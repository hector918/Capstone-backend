const db = require("./db-config");
const {timestamp, error_handle} = require('./db-general');


const insertNewPrompt = async(user_id, type, title, content) => {
  try {
    const ret = await db.one(`
    WITH prompts AS (
      INSERT INTO prompts (type, content, title, timestamp)
      VALUES ($[type], $[content], $[title], $[timestamp])
      RETURNING *
    ),
    user_to_prompt AS (
      INSERT INTO user_to_prompt (user_id, prompt_id, timestamp)
      SELECT $[user_id], id, $[timestamp] FROM prompts RETURNING *
    )
    SELECT * FROM prompts, user_to_prompt;
    `, {user_id, title, type, content, ...timestamp()});
    return ret;
  } catch (error) {
    error_handle(error);
    return false;
  }
}

const readAllPromptByUser = async(user_id) => {
  try {
    const ret = await db.manyOrNone(`
    SELECT pl.*, up.user_id, up.timestamp
      FROM prompts AS pl
      LEFT JOIN user_to_prompt AS up ON up.prompt_id = pl.id 
      WHERE user_id = $[user_id]`, {user_id});
    return ret;
  } catch (error) {
    error_handle(error);
    return false;
  }
}

module.exports = {insertNewPrompt, readAllPromptByUser}