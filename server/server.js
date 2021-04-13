const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db");
const bcrypt = require("./utils/bcrypt");
const ses = require("./utils/ses");
const crs = require("./utils/crypto-random");
const multer = require("./utils/multer");
const s3 = require("./utils/aws");

// ================================ HELPERS ================================ //
const succeed = (res, response) =>
    res.json({ success: true, response: response });
const fail = (res, err) => res.json({ success: false, error: err });
const clientDir = (file) => path.join(__dirname, "..", "client", file);

// ================================ INIT ================================ //
const app = express();

const morgan = require("morgan");
app.use(morgan("tiny"));

app.use(compression());

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(express.json());

app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET || "whatever",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static(clientDir("public")));

app.get("/welcome", ifLogged("in", "/"), (req, res) =>
    res.sendFile(clientDir("index.html"))
);

// =============== USER PROFILES =============== //
app.get("/user", ifLogged("out", "/welcome"), (req, res, next) =>
    db
        .getUserProfile(req.session.userId)
        .then((user) => {
            return res.json({
                success: true,
                user,
            });
        })
        .catch((err) =>
            next({ caught: true, myCode: "db_notfound", originalError: err })
        )
);

app.get("/user/:id.json", (req, res, next) =>
    db
        .getUserProfile(req.params.id)
        .then((user) => {
            return res.json({
                success: true,
                user,
            });
        })
        .catch((err) =>
            next({ caught: true, myCode: "db_notfound", originalError: err })
        )
);

// =============== USER SEARCH =============== //
app.get("/users", (req, res, next) => {
    const query = req.query.q ? db.searchUsers(req.query.q) : db.newestUsers();
    return query
        .then((users) => res.json({ success: true, users }))
        .catch((err) =>
            next({ caught: true, myCode: "db_notfound", originalError: err })
        );
});

// =============== ACCOUNT OPERATIONS =============== //
app.post("/register", validate("register"), async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password);
    const result = await db.addUser(req.body);
    if (result.length === 0 || !result[0].id)
        return fail(res, "Couldn't add user.");
    req.session.userId = result[0].id;
    return succeed(res);
});

app.post("/login", validate("login"), async (req, res) => {
    const userProfile = await db.getUserByEmail(req.body.email);
    if (userProfile.length === 0) return fail(res, "Wrong e-mail or password.");
    const match = await bcrypt.compare(
        req.body.password,
        userProfile[0].password
    );
    if (!match) return fail(res, "Wrong e-mail or password.");
    req.session.userId = userProfile[0].id;
    return succeed(res);
});

app.post(
    "/password/reset/start",
    validate("email"),
    async (req, res, next) => {
        const userProfile = await db.getUserByEmail(req.body.email);
        if (userProfile.length === 0) return fail(res, "Wrong e-mail.");
        return next();
    },
    (req, res) =>
        db
            .addCode(req.body.email, crs.getCode())
            .then((rows) =>
                ses.sendEmail(
                    req.body.email,
                    rows[0].code,
                    "Your verification code"
                )
            )
            .then(() => succeed(res))
            .catch((err) => {
                console.log(err);
                return fail(res, "Couldn't record your code.");
            })
);

app.post("/password/reset/verify", validate("verify"), async (req, res) => {
    const trueCode = await db.getCode(req.body.email);
    if (req.body.code != trueCode) return fail(res, "Wrong verification code.");
    req.body.password = await bcrypt.hash(req.body.password);
    return db
        .changePassword(req.body)
        .then(() => succeed(res))
        .catch((err) => {
            console.log(err);
            return fail(res, "Couldn't update password.");
        });
});

// =============== PROFILE EDIT =============== //
app.post(
    "/profile-pic",
    ifLogged("out", "/welcome"),
    multer.upload.single("file"),
    (req, res, next) => (!req.file ? fail(res, "Couldn't save file.") : next()),
    s3.upload,
    (req, res, next) =>
        db
            .addProfilePic(
                `https://cardamom-social.s3.amazonaws.com/${req.file.filename}`,
                req.session.userId
            )
            .then((url) => res.json({ success: true, url }))
            .catch((err) =>
                next({ caught: true, myCode: "db_noupdate", orginalError: err })
            )
);

app.post("/bio", ifLogged("out", "/welcome"), (req, res, next) =>
    db
        .addBio(req.body.draft, req.session.userId)
        .then(() => res.json({ success: true }))
        .catch((err) =>
            next({ caught: true, myCode: "db_noupdate", originalError: err })
        )
);

// =============== FRIENDSHIPS =============== //
app.route("/friendship/:id/:reject?")
    .get(ifLogged("out", "/welcome"), async (req, res, next) => {
        const ids = { sender: req.session.userId, recipient: req.params.id };

        const [result] = await db.checkFriendship(ids);
        let status;
        if (!result) {
            status = "none";
        } else if (result.accepted) {
            status = "friends";
        } else if (result.sender === ids.sender) {
            status = "waiting";
        } else {
            status = "open";
        }
        return res.json({ success: true, status });
    })
    .post(ifLogged("out", "/welcome"), async (req, res, next) => {
        const ids = { sender: req.session.userId, recipient: req.params.id };
        const [result] = await db.checkFriendship(ids);
        let operation;
        if (!result) {
            operation = db.askFriendship(ids);
        } else if (
            result.accepted ||
            result.sender === ids.sender ||
            req.params.reject === "reject"
        ) {
            operation = db.deleteFriendship(ids);
        } else {
            operation = db.acceptFriendship(ids);
        }
        return operation
            .then((status) => {
                return res.json({ success: true, status });
            })
            .catch((err) =>
                next({ caught: true, myCode: "db_error", originalError: err })
            );
    });

// =============== GENERAL =============== //
app.get("*", ifLogged("out", "/welcome"), function (req, res) {
    res.sendFile(clientDir("index.html"));
});

app.use((err, req, res, next) => {
    const ERRORS = {
        db_error: "Database error.",
        db_notfound: "Couldn't find entry in the database.",
        db_noupdate: "Couldn't update entry in the database.",
        bad_request: "Invalid request data.",
    };
    const { stack } = err.caught ? err.originalError : err;
    console.log(stack);
    if (err.caught)
        return res.json({ success: false, error: ERRORS[err.myCode] });
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// ================================ MIDDLEWARE ================================ //
function ifLogged(state, redirection) {
    return (req, res, next) => {
        const test = state == "in" ? req.session.userId : !req.session.userId;
        if (test) return res.redirect(redirection);
        return next();
    };
}

function validate(what) {
    return (req, res, next) => {
        let required = ["email"];
        if (what === "register" || what === "login") required.push("password");
        if (what === "register") required.push("first", "last");
        if (what === "verify") required = ["code", "password"];
        const invalid = required.filter((el) => !req.body[el]);
        if (invalid.length === 0) return next();
        return fail(
            res,
            `Please fill out required field(s): ${invalid.join(", ")}.`
        );
    };
}
