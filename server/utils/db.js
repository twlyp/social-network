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
            .then((res) => res.rows[0].id),
    getUserByEmail: (email) =>
        db
            .query(
                `SELECT * FROM users
                WHERE email = $1`,
                [email]
            )
            .then((res) => res.rows[0]),
    getUserProfile: (id) =>
        db
            .query(
                `SELECT id, first, last, image, bio
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
    searchUsers: (search) =>
        db
            .query(
                `SELECT id, first, last, email
                FROM users
                WHERE first || ' ' || last || ' ' || email ILIKE $1
                LIMIT 3`,
                ["%" + search + "%"]
            )
            .then((res) => res.rows),

    // add details stuff
    addProfilePic: (url, id) =>
        db
            .query(
                `UPDATE users
                SET image = $1
                WHERE id = $2
                RETURNING image`,
                [url, id]
            )
            .then((result) => result.rows[0].image),
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
                VALUES ($1, $2, false)`,
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
    getFriends: (id) =>
        db
            .query(
                `SELECT users.id, first, last, image, accepted
                    FROM friendships
                    JOIN users
                    ON (accepted = false AND recipient = $1 AND sender = users.id)
                    OR (accepted = true AND recipient = $1 AND sender = users.id)
                    OR (accepted = true AND sender = $1 AND recipient = users.id)`,
                [id]
            )
            .then((result) => result.rows),

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
            .then((res) => res.rows[0].code),
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

    // chat stuff
    getMessages: () =>
        db
            .query(
                `SELECT chat.id, chat.sender, chat.text,
                   TO_CHAR(chat.created_at, 'YYYY-MM-DD HH24:MI') AS time,
                   users.first, users.last, users.image
                FROM chat, users
                WHERE chat.sender = users.id
                ORDER BY chat.created_at DESC
                LIMIT 10`
            )
            .then(({ rows }) => rows),
    addMessage: ({ text, userId: sender }) =>
        db
            .query(
                `INSERT INTO chat (text, sender)
                VALUES ($1, $2)
                RETURNING id, sender, text,
                    TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') AS time`,
                [text, sender]
            )
            .then(({ rows }) => rows[0]),
};
