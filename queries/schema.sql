
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

CREATE TABLE session (
    sid character varying PRIMARY KEY,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);

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

CREATE TABLE documents (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    filehash text,
    timestamp timestamp without time zone,
    uploader integer
);

CREATE TABLE user_to_documents (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id integer,
    document_id integer,
    timestamp timestamp without time zone,
    is_share boolean DEFAULT false,
    is_favorite boolean DEFAULT false,
    "order" integer DEFAULT 1
);

CREATE TABLE user_logs (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id text,
    action text,
    result text,
    timestamp timestamp without time zone
);


CREATE TABLE user_to_comprehension_history (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id text,
    comperhension_history_id integer,
    is_share boolean DEFAULT false,
    timestamp timestamp without time zone
);

CREATE TABLE reading_comprehension_chat_history (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    q text,
    result json,
    timestamp timestamp without time zone,
    filehash text,
    usage integer,
    level text
);

CREATE TABLE user_to_text_explaination_history (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id text,
    text_explaination_history_id integer,
    is_share boolean DEFAULT false,
    timestamp timestamp without time zone
);

CREATE TABLE text_explaination_chat_history (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    q text,
    result json,
    timestamp timestamp without time zone,
    filehash text,
    usage integer
);
