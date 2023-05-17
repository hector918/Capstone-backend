const db = require("../queries/db-config");

const insert_to_api_usage = async (body) => {
  //only accept below key name
  const templete = {"user_name":"text", "user_input":"text", "caller":"text", "json":"object", "req_usage":"number", "url":"text", "ip_address":"text"};
  const [col_name, val_name] = [[], []];
  //checking column name
  for(let x in body) if(templete[x]){
    col_name.push(x);
    val_name.push(`$[${x}]`);
  }
  //if not matching exit
  if(col_name.length === 0) return false;
  try {
    //insert to db
    const ret = await db.one(`INSERT INTO api_usage (${col_name.join(", ")}) VALUES (${val_name.join(", ")}) RETURNING *`, body);
    return ret;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const read_api_usage = async (start = 0, limit = 100) => {
  const display_fields = [
    'timestamp', 
    'user_input', 
    'caller', 
    'url', 
    'json', 
    'req_usage', 
    'ip_address'
  ];
  try {
    return await db.any(`SELECT ${display_fields.join(',')} FROM api_usage ORDER BY timestamp DESC OFFSET $[start] LIMIT $[limit];`, { start, limit });
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {insert_to_api_usage, read_api_usage}

/*
DROP TABLE IF EXISTS api_usage;
CREATE TABLE api_usage (
    id SERIAL PRIMARY KEY,
    user_name TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    user_input TEXT,
    caller TEXT,
    url TEXT,
    json JSON,
    req_usage INTEGER,
    "ip_address" varchar(50),
);
-- -------------------------------------------------------------
-- TablePlus 5.3.6(496)
--
-- https://tableplus.com/
--
-- Database: capstone_project
-- Generation Time: 2023-05-16 17:49:07.6810
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS api_usage_id_seq;

-- Table Definition
CREATE TABLE "public"."api_usage" (
    "id" int4 NOT NULL DEFAULT nextval('api_usage_id_seq'::regclass),
    "user_name" text,
    "timestamp" timestamp DEFAULT now(),
    "user_input" text,
    "caller" text,
    "url" text,
    "json" json,
    "req_usage" int4,
    "ip_address" varchar(50),
    PRIMARY KEY ("id")
);


*/

