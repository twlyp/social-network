const router = require("express").Router();
const { isLoggedIn, validate } = require("./middleware");
const multer = require("../utils/multer");
const s3 = require("../utils/aws");
const db = require("../utils/db");

const conf = require("../config");

router.use(isLoggedIn);

router.post(
    "/profile-pic",
    multer.upload.single("file"),
    validate.file,
    s3.upload,
    async (req, res, next) => {
        try {
            const image = await db.addProfilePic(
                conf.AWS_BUCKET_URL + req.file.filename,
                req.session.userId
            );
            return res.json({ success: true, image });
        } catch (err) {
            if (err instanceof TypeError)
                return next({ myCode: "db_noupdate" });
            return next();
        }
    }
);

router.post("/bio", async (req, res, next) => {
    try {
        await db.addBio(req.body.draft, req.session.userId);
        return res.json({ success: true });
    } catch (err) {
        return next({ myCode: "db_noupdate" });
    }
});

module.exports = router;
