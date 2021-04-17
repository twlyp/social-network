const express = require("express");
const app = express();

const path = require("path");
const {
    isLoggedIn,
    isLoggedOut,
    errorHandler,
} = require("./routes/middleware");

const cookieSession = require("cookie-session")({
    secret:
        process.env.SESSION_SECRET ||
        "trentatré trentini entrarono a trento tutti e trentatré trotterellando",
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
app.use(
    express.urlencoded({
        extended: false,
    }),
    express.json(),
    express.static(path.join(__dirname, "..", "client", "public")),
    cookieSession,
    require("morgan")("tiny"),
    require("compression")(),
    require("csurf")(),
    (req, res, next) => {
        res.cookie("mytoken", req.csrfToken());
        return next();
    }
);

// routes
app.get("/welcome", isLoggedOut, (req, res) =>
    res.sendFile(path.join(__dirname, "..", "client", "index.html"))
);

app.use(require("./routes/users")); // user profiles and user search
app.use(require("./routes/account")); // register, login, logout, reset password
app.use(require("./routes/edit-profile")); // edit profile (pic and bio)
app.use(require("./routes/friendships")); // friendships

app.get("*", isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.use(errorHandler);

// server for socket.io
const server = require("http").Server(app);

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

const init = require("./socket");
init(server, cookieSession);
