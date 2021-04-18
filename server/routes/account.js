const router = require("express").Router();
const { isLoggedOut, validate } = require("./middleware");
const db = require("../utils/db");
const bcrypt = require("../utils/bcrypt");
const crs = require("../utils/crypto-random");
const ses = require("../utils/ses");

router.post(
    "/register",
    isLoggedOut,
    validate.name,
    validate.email,
    validate.password,
    async (req, res, next) => {
        req.body.password = await bcrypt.hash(req.body.password);
        try {
            const id = await db.addUser(req.body);
            req.session.userId = id;
            return res.json({ success: true });
        } catch (err) {
            if (err.constraint === "users_email_key")
                return next({ myCode: "duplicate_email" });
            if (err instanceof TypeError)
                return next({ myCode: "db_noinsert" });
            return next(err);
        }
    }
);

router.post(
    "/login",
    isLoggedOut,
    validate.email,
    validate.password,
    async (req, res, next) => {
        const user = await db.getUserByEmail(req.body.email);
        if (!user) return next({ myCode: "bad_login" });
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return next({ myCode: "bad_login" });
        req.session.userId = user.id;
        return res.json({ success: true });
    }
);

router.post("/logout", (req, res) => {
    req.session = null;
    return res.json({ success: true });
});

router.post("/password/reset/start", validate.email, async (req, res, next) => {
    const user = await db.getUserByEmail(req.body.email);
    if (!user) return next({ myCode: "bad_email" });
    try {
        const code = await db.addCode(req.body.email, crs.getCode());
        await ses.sendEmail(req.body.email, code, "Your verification code");
        return res.json({ success: true });
    } catch (err) {
        if (err instanceof TypeError) return next({ myCode: "db_notfound" });
        return next(err);
    }
});

router.post(
    "/password/reset/verify",
    validate.password,
    validate.code,
    async (req, res, next) => {
        try {
            const trueCode = await db.getCode(req.body.email);
            if (req.body.code != trueCode) return next({ myCode: "bad_code" });
            req.body.password = await bcrypt.hash(req.body.password);
            await db.changePassword(req.body);
            return res.json({ success: true });
        } catch (err) {
            if (err instanceof TypeError)
                return next({ myCode: "db_notfound" });
            return next(err);
        }
    }
);

module.exports = router;
