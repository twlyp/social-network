-- DROP TABLE IF EXISTS users CASCADE;

-- CREATE TABLE users(
--     id SERIAL PRIMARY KEY,
--     first VARCHAR(255) NOT NULL,
--     last VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     profile_pic VARCHAR(255),
--     bio TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- DROP TABLE IF EXISTS reset_codes;

-- CREATE TABLE reset_codes(
--     id SERIAL PRIMARY KEY,
--     email VARCHAR(255) NOT NULL,
--     code VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- DROP TABLE IF EXISTS friendships;

-- CREATE TABLE friendships( 
--   id SERIAL PRIMARY KEY, 
--   sender INT REFERENCES users(id) ON DELETE CASCADE NOT NULL, 
--   recipient INT REFERENCES users(id) ON DELETE CASCADE NOT NULL, 
--   accepted BOOLEAN DEFAULT false);

