CREATE DATABASE ScreenCast;

\c ScreenCast;

CREATE SCHEMA dbo;

CREATE TABLE dbo."User"
(
    id            uuid         NOT NULL
        CONSTRAINT "pk_User"
            PRIMARY KEY,
    email         VARCHAR(350) NOT NULL,
    password      VARCHAR(500) NOT NULL,
    is_subscribed BOOLEAN,
    created_at    TIMESTAMP(3) NOT NULL
);

CREATE TABLE dbo."Recording"
(
    id          uuid         NOT NULL
        CONSTRAINT "pk_Recording"
            PRIMARY KEY,
    user_id     uuid         NOT NULL
        CONSTRAINT "fk_Recording_User"
            REFERENCES dbo."User",
    created_at  TIMESTAMP(3) NOT NULL,
    finished_at TIMESTAMP(3)
);
