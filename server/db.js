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

    // user searches
    newestUsers: () =>
        db
            .query(
                `SELECT id, first, last
                FROM users
                ORDER BY id DESC
                LIMIT 3`
            )
            .then((res) => res.rows),
    searchUsers: (str) =>
        db
            .query(
                `SELECT id, first, last
                FROM users
                WHERE first || ' ' || last ILIKE $1
                LIMIT 3`,
                ["%" + str + "%"]
            )
            .then((res) => res.rows),

    // add details stuff
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

    // friendship stuff
    checkFriendship: ({ sender, recipient }) =>
        db
            .query(
                `SELECT * FROM friendships
                WHERE (recipient = $1 AND sender = $2)
                OR (recipient = $2 AND sender = $1)`,
                [sender, recipient]
            )
            .then((result) => result.rows),
    askFriendship: ({ sender, recipient }) =>
        db
            .query(
                `INSERT INTO friendships
                (sender, recipient, accepted)
                VALUES $1, $2, false`,
                [sender, recipient]
            )
            .then(() => "waiting"),
    deleteFriendship: ({ sender, recipient }) =>
        db
            .query(
                `DELETE FROM friendships
                WHERE (recipient = $1 AND sender = $2)
                OR (recipient = $2 AND sender = $1)`,
                [sender, recipient]
            )
            .then(() => "none"),
    acceptFriendship: ({ sender, recipient }) =>
        db
            .query(
                `UPDATE friendships
                SET accepted = true
                WHERE (recipient = $1 AND sender = $2)`,
                [sender, recipient]
            )
            .then(() => "friends"),

    // change password stuff
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
