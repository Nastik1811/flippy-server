CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE cards;
DROP TABLE collections;
DROP TABLE users;
DROP TYPE card_status;

CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 (),
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

CREATE TYPE card_status AS enum('new', 'learning', 'review');

CREATE TABLE collections (
    id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    last_edited TIMESTAMP,
    created TIMESTAMP NOT NULL
);

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collection_id INT REFERENCES collections(id) ON DELETE SET NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    created TIMESTAMP NOT NULL,
    last_edited TIMESTAMP,
    status card_status,
    last_review TIMESTAMP,
    scheduled_review TIMESTAMP
);
