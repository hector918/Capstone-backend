const db = require("./db-config");
const crypto = require('crypto');
//////////////////////////////////////////////////
const log_user_action = (user_id, action, result = "") => {
  const timestamp = new Date().toUTCString();
  try {
    db.none(`INSERT INTO user_logs (user_id, action, result, timestamp) VALUES ($[user_id], $[action], $[result], $[timestamp] )`, {user_id, action, result, timestamp});
  } catch (error) {
    console.error("log user error");
  }
}

const create_an_user = async (newUserJson) => {
  const [col_name, val_name] = [[], []];
  const templete = {"user_id":"text", "username":"text", "current_session":"text", "password":"text", "last_seen":"text", "availability":"bool", "ip_address":"text"};
  for(let key in templete) if(newUserJson[key]){
    col_name.push(key);
    val_name.push(`$[${key}]`);
  }
  if(col_name.length === 0) return false;
  try {
    const ret = await db.one(`INSERT INTO "user" ("${col_name.join('", "')}") VALUES (${val_name.join(", ")}) RETURNING *`, newUserJson);
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }

};

const create_third_party_user = async (newUserJson) => {
  const [col_name, val_name] = [[], []];
  const templete = {"user_id":"text", "username":"text", "current_session":"text", "password":"text", "last_seen":"text", "availability":"bool", "ip_address":"text", "email":"text", "third_party_login":"int"};
  for(let key in templete) if(newUserJson[key]){
    col_name.push(key);
    val_name.push(`$[${key}]`);
  }
  if(col_name.length === 0) return false;
  try {
    const ret = await db.one(`INSERT INTO "user" ("${col_name.join('", "')}") VALUES (${val_name.join(", ")}) ON CONFLICT (user_id) DO UPDATE SET last_seen = $[last_seen], ip_address = $[ip_address], current_session = $[current_session] RETURNING *`, newUserJson);
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
};


const login = async (userForm) => {
  try {
    // const ret = await db.one(`SELECT * FROM public.user WHERE availability = 'true' AND userid = $[userid] and password = $[password]`, userForm);
    const ret = await db.one(`UPDATE "user" SET last_seen = '${new Date().toUTCString()}' WHERE availability = 'true' AND user_id = $[user_id] and password = $[password] and third_party_login = 0 RETURNING *;`, userForm);
    log_user_action(userForm.user_id, "user try to login", JSON.stringify(ret));
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const update_user_profile = async(user_id, profile) => {
  try {
    const ret = await db.one(`UPDATE "user" SET profile_setting = $[profile] WHERE user_id = $[user_id] RETURNING *;`, {user_id, profile})
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const check_userID_available = async (user_id) => {
  try {
    const ret = await db.oneOrNone(`SELECT current_session FROM "user" WHERE "user_id" = $[user_id]`, {user_id});
    return ret === null;
  } catch (error) {
    console.log(error);
    return false;
  }
}
const user_password_hash = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
}
//////////////////////////////////////////////////
module.exports = { 
  create_an_user, 
  create_third_party_user,
  check_userID_available, 
  user_password_hash, 
  login,
  log_user_action,
  update_user_profile,
};
