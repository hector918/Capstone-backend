require("dotenv").config();
const session = require("express-session");
const genFunc = require("connect-pg-simple");
const PostgresqlStore = genFunc(session);
const sessionStore = new PostgresqlStore({
  conString : `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`
});

function applySession (app){
  app.use(session({
    secret: 'sessionsecret123593405843059',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 * 100 }, // 86400000 = 1 day
    sameSite : "lax",
    store: sessionStore
  }));
}

module.exports = applySession;

/* sql seeding
  CREATE TABLE session (sid varchar NOT NULL COLLATE "default", sess json NOT NULL, expire timestamp(6) NOT NULL  ) WITH (OIDS=FALSE);
  ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;
  CREATE INDEX idx_session_expire ON session (expire);  
*/