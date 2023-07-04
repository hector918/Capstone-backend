const db = require("./db-config");
const crypto = require('crypto');

const create_an_user = async (newUserJson) => {
  const [col_name, val_name] = [[], []];
  const templete = {"user_id":"text", "current_session":"text", "passcode":"text", "last_seen":"text", "availability":"bool", "ip_address":"text"};
  for(let key in templete) if(newUserJson[key]){
    col_name.push(key);
    val_name.push(`$[${key}]`);
  }
  if(col_name.length === 0) return false;

  try {
    const ret = await db.one(`INSERT INTO "user" (${col_name.join(", ")}) VALUES (${val_name.join(", ")}) RETURNING *`, newUserJson);
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }

};

const check_userID_available = async (userID) => {
  try {
    const ret = await db.oneOrNone(`SELECT current_session FROM "user" WHERE "userId" = $[userID]`, {userID});
    return ret === null;
  } catch (error) {
    console.log(error);
    return false;
  }
}
const user_password_hash = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = { create_an_user, check_userID_available, user_password_hash };
