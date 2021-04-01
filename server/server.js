const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

const succeed = (res) => res.json({ success: true });
const fail = (res) => res.json({ success: false });
const staticize = (file) => path.join(__dirname, "..", "client", file);

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
    res.cookie("csrf_token", req.csrfToken());
    next();
});

app.use(express.static(staticize("public")));

app.get("/welcome", ifLogged("in", "/"), (req, res) =>
    res.sendFile(staticize("index.html"))
);

app.get("*", function (req, res) {
    res.sendFile(staticize("index.html"));
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
