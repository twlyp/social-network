const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db");
const bcrypt = require("./bcrypt");
const ses = require("./ses");
const crs = require("./crypto-random");

// ================================ HELPERS ================================ //
const succeed = (res) => res.json({ success: true });
const fail = (res, err) => res.json({ success: false, error: err });
const clientDir = (file) => path.join(__dirname, "..", "client", file);

// ================================ INIT ================================ //
const app = express();

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

app.get("*", ifLogged("out", "/welcome"), function (req, res) {
    res.sendFile(clientDir("index.html"));
});

app.post("/register", validate("register"), async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password);
    const result = await db.addUser(req.body);
    if (result.length === 0 || !result[0].id)
        return fail(res, "Couldn't add user.");
    req.session.userId = result[0].id;
    return succeed(res);
});

app.post("/login", validate("login"), async (req, res) => {
    const userProfile = await db.getUserFromEmail(req.body.email);
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
        const userProfile = await db.getUserFromEmail(req.body.email);
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

app.use((req, res, next, err) => console.log(err));

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
        const required = ["email", "password"];
        if (what === "register") required.push("first", "last");
        const invalid = required.filter((el) => !req.body[el]);
        // console.log("req.body:", req.body);
        // console.log("invalid: ", invalid);
        if (invalid.length === 0) return next();
        return fail(
            res,
            `Please fill out required field(s): ${invalid.join(", ")}.`
        );
    };
}
