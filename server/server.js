const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

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

app.post("/register", validate("register"), (req, res, next) =>
    db.addUser(req.body)
);

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
    if (what === "register")
        return (req, res, next) => {
            const required = ["first", "last", "email", "password"];
            const invalid = required.filter((el) => !req.body[el]);
            if (invalid.length === 0) return next();
            return fail(
                res,
                `Please fill out required field(s): ${invalid.join(", ")}.`
            );
        };
}
