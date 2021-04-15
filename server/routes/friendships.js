const router = require("express").Router();
const { isLoggedIn, validate } = require("./middleware");
const db = require("../utils/db");

router.use(isLoggedIn);

router.get("/friendship/:id", async (req, res, next) => {
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
});

router.post("/friendship/:id/:action?", async (req, res, next) => {
    const ids = { sender: req.session.userId, recipient: req.params.id };
    const actions = ["ask", "delete", "accept"];
    let action = req.params.action;
    if (actions.includes(action)) {
        const status = await db[`${action}Friendship`](ids);
        return res.json({ success: true, status });
    }
    return next({ myCode: "bad_command" });
});

router.get("/friends-wannabes", async (req, res, next) => {
    const friends = await db.getFriends(req.session.userId);
    return res.json({ success: true, friends });
});

module.exports = router;
