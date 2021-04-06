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
    getUserFromEmail: (email) =>
        db
            .query(
                `SELECT * FROM users
                WHERE email = $1`,
                [email]
            )
            .then((res) => res.rows),
    addCode: ({ email, code }) =>
        db
            .query(
                `INSERT INTO reset_codes (email, code)
                VALUES ($1, $2)
                RETURNING code`,
                [email, code]
            )
            .then((res) => res.rows),
    getCode: db.query(),
};
