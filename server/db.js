const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL || "postgres:leo@localhost/social"
);

module.exports = {
    addUser: ({ first, last, email, password }) =>
        db
            .query(
                `INSERT INTO users (first, last, email, password)
                VALUES ($1, $2, $3, $4)
                RETURNING id`,
                [first, last, email, password]
            )
            .then((res) => res.rows),
    getUserByEmail: (email) =>
        db
            .query(
                `SELECT * FROM users
                WHERE email = $1`,
                [email]
            )
            .then((res) => res.rows),
    getUserProfile: (id) =>
        db
            .query(
                `SELECT id, first, last, profile_pic AS url, bio
                FROM users WHERE id = $1`,
                [id]
            )
            .then((res) => res.rows[0]),
    addProfilePic: (url, id) =>
        db
            .query(
                `UPDATE users
                SET profile_pic = $1
                WHERE id = $2
                RETURNING profile_pic AS url`,
                [url, id]
            )
            .then((result) => result.rows[0].url),
    addBio: (bio, id) =>
        db.query(
            `UPDATE users
                SET bio = $1
                WHERE id = $2`,
            [bio, id]
        ),
    changePassword: ({ email, password }) =>
        db.query(
            `UPDATE users
                SET password = $2
                WHERE email = $1`,
            [email, password]
        ),
    addCode: (email, code) =>
        db
            .query(
                `INSERT INTO reset_codes (email, code)
                VALUES ($1, $2)
                RETURNING code`,
                [email, code]
            )
            .then((res) => res.rows),
    getCode: (email) =>
        db
            .query(
                `SELECT code FROM reset_codes
                WHERE CURRENT_TIMESTAMP - created_at
                    < INTERVAL '10 minutes'
                    AND email = $1
                ORDER BY created_at DESC
                LIMIT 1`,
                [email]
            )
            .then((result) => result.rows[0].code),
};
