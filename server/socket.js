const db = require("./utils/db");

module.exports = function (server, cookieSession) {
    const io = require("socket.io")(server, {
        allowRequest: (req, callback) =>
            callback(
                null,
                req.headers.referer.startsWith("http://localhost:3000")
            ),
    });

    io.use(function (socket, next) {
        cookieSession(socket.request, socket.request.res, next);
    });

    io.on("connection", async (socket) => {
        console.log(`A socket with the id ${socket.id} just CONNECTED`);
        if (!socket.request.session.userId) return socket.disconnect(true);

        const msgs = await db.getMessages();
        socket.emit("chatHistory", msgs);

        socket.on("chatMessage", async (text) => {
            const userId = socket.request.session.userId;
            const [msg, user] = await Promise.all([
                db.addMessage({ text, userId }),
                db.getUserProfile(userId),
            ]);
            io.emit("chatMessage", {
                ...msg,
                first: user.first,
                last: user.last,
                image: user.image,
            });
        });

        socket.on("disconnect", () => {
            console.log(`A socket with the id ${socket.id} just DISCONNECTED`);
        });
    });
};
