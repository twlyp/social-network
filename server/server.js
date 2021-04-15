const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

const {
    isLoggedIn,
    isLoggedOut,
    errorHandler,
} = require("./routes/middleware");

// ================================ INIT ================================ //
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

// ================================ MORGAN ================================ //
const morgan = require("morgan");
app.use(morgan("tiny"));

app.use(
    compression(),
    express.urlencoded({
        extended: false,
    })
);

// app.use(
//     express.urlencoded({
//         extended: false,
//     })
// );

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

app.use(express.static(path.join(__dirname, "..", "client", "index.html")));

// ====================== ROUTES ====================== //
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

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// io.on("connection", (socket) => {
//     console.log(`A socket with the id ${socket.id} just CONNECTED`);
//     socket.emit("welcome", {
//         msg: "It is nice to see you.",
//     });
//     io.emit("newUser", {
//         data: "a new user joined",
//     });
//     socket.on("yo", (data) => {
//         console.log(data);
//     });
//     socket.on("disconnect", () => {
//         console.log(`A socket with the id ${socket.id} just DISCONNECTED`);
//     });
// });
