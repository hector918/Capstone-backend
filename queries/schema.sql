-- DDL generated by Postico 2.0.4
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    current_session character varying,
    userid text,
    username text,
    password character varying,
    credit bigint DEFAULT 0,
    power text,
    last_seen timestamp without time zone,
    availability boolean DEFAULT false,
    profile_setting json NOT NULL DEFAULT '{}'::json,
    temp_passcode text DEFAULT ''::text,
    ip_address text
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX user_pkey ON "user"(id int4_ops);
CREATE UNIQUE INDEX "userID_pkey" ON "user"(userid text_ops);

-- DDL generated by Postico 2.0.4
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE session (
    sid character varying PRIMARY KEY,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX session_pkey ON session(sid text_ops);
CREATE INDEX idx_session_expire ON session(expire timestamp_ops);

-- DDL generated by Postico 2.0.4
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    user_name text,
    timestamp timestamp without time zone DEFAULT now(),
    user_input text,
    caller text,
    url text,
    json json,
    req_usage integer,
    ip_address character varying(50)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX api_usage_pkey ON api_usage(id int4_ops);
