CREATE DATABASE ScreenCast;

\c ScreenCast;

CREATE SCHEMA dbo;

CREATE TABLE dbo.Subscription (
  idSubscription INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idUser INTEGER NOT NULL,
  subscription_begin TIMESTAMP NOT NULL,
  subscription_end TIMESTAMP NOT NULL,
  payment_infos TEXT,
  description VARCHAR(500)
);

CREATE TABLE dbo.Users (
  idUser INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  signs BOOLEAN,
  created_at TIMESTAMP
);

CREATE TABLE dbo.Recordings (
  idRecordings INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  Recording_Url VARCHAR(500),
  idUser INTEGER NOT NULL,
  idStatus INTEGER NOT NULL,
  created_at TIMESTAMP,
  FOREIGN KEY (idUser) REFERENCES dbo.Users(idUser),
  FOREIGN KEY (idStatus) REFERENCES dbo.Status(idStatus)
);

CREATE TABLE dbo.Status (
  idStatus INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  description VARCHAR
);


CREATE USER readonly WITH PASSWORD 'readonly_password';
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA dbo TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA dbo TO readonly;

CREATE USER updater WITH PASSWORD 'updater_password';
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA dbo TO updater;
GRANT SELECT, UPDATE ON ALL TABLES IN SCHEMA dbo TO updater;

CREATE USER admin WITH PASSWORD 'admin_password';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA dbo TO admin;