const { genSalt, hash, compare } = require("bcryptjs");

// compare will compare the password that the user types in with the hash in our db
module.exports.compare = compare;

// hash calls genSalt first
// THEN it hashes the password from the user, using the salt and the hash method.
module.exports.hash = (password) =>
    genSalt().then((salt) => hash(password, salt));
