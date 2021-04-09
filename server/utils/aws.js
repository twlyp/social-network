const aws = require("aws-sdk");
const fs = require("fs");

const secrets =
    process.env.NODE_ENV == "production"
        ? JSON.parse(process.env.SECRETS)
        : require("./secrets");

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
    const { filename, mimetype, size, path } = req.file;

    return s3
        .putObject({
            Bucket: "cardamom-social",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise()
        .then(() => {
            fs.unlink(path, () => {});
            next();
        })
        .catch((err) => next(err));
};
