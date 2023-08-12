const db = require("./db-config");
const {timestamp, error_handle} = require('./db-general');


const insertNewPrompt = async(user_id, type, title, content, json) => {
  try {
    const ret = await db.one(`
    WITH prompts AS (
      INSERT INTO prompts (type, content, title, json, timestamp)
      VALUES ($[type], $[content], $[title], $[json], $[timestamp])
      RETURNING *
    ),
    user_to_prompt AS (
      INSERT INTO user_to_prompt (user_id, prompt_id, timestamp)
      SELECT $[user_id], id, $[timestamp] FROM prompts RETURNING *
    )
    SELECT prompts.*, user_to_prompt.timestamp FROM prompts, user_to_prompt;
    `, {user_id, title, type, content, json, ...timestamp()});
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

const deletePrompt = async(user_id, prompt_id) => {
  try {
    const ret = await db.oneOrNone(`
      with deleted_user_to_prompt AS (
        DELETE FROM user_to_prompt WHERE user_id = $[user_id] and prompt_id = $[prompt_id] RETURNING *
      )
      DELETE FROM prompts where id = (SELECT prompt_id FROM deleted_user_to_prompt) RETURNING *;
    `, {user_id, prompt_id});
    return ret;
  } catch (error) {
    error_handle(error);
    return false;
  }
}


module.exports = {
  insertNewPrompt, 
  readAllPromptByUser,
  deletePrompt
}