const db = require("../queries/db-config");


const create_an_user = async (body) => {
  
};

/**
 
 CREATE TABLE "public"."user" ("id" serial,"current_session" varchar,"user_id" text,"user_name" text,"passcode" varchar,"credit" int8,"power" text,"last_seen" timestamp,"availability" bool DEFAULT 'false', PRIMARY KEY ("id"));
 */