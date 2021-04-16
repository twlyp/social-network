const router = require("express").Router();
const { isLoggedIn } = require("./middleware");
const db = require("../utils/db");

router.get("/user", isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.getUserProfile(req.session.userId);
        return res.json({ success: true, user });
    } catch (err) {
        if (err instanceof TypeError) return next({ myCode: "db_notfound" });
        return next(err);
    }
});

router.get("/user/:id.json", async (req, res, next) => {
    if (req.session.userId == req.params.id)
        return res.json({ success: false, error: "" });
    try {
        const user = await db.getUserProfile(req.params.id);
        return res.json({ success: true, user });
    } catch (err) {
        if (err instanceof TypeError) return next({ myCode: "db_notfound" });
        return next(err);
    }
});

router.get("/users", async (req, res, next) => {
    const users = req.query.q
        ? await db.searchUsers(req.query.q)
        : await db.newestUsers();
    return res.json({ success: true, users });
});

module.exports = router;
