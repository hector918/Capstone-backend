const db = require("./db-config");
const {timestamp, error_handle} = require('./db-general');

const insertTextToExplainationHistory = async(user_id, filehash, q, result, usage) => {
  //
  try {
    const ret = await db.one(`
    WITH history AS (
      INSERT INTO text_explaination_chat_history (q, result, timestamp, filehash, usage)
      VALUES ($[q], $[result], $[timestamp], $[filehash], $[usage])
      RETURNING *
    ),
    user_to_history AS (
      INSERT INTO user_to_text_explaination_history (user_id, text_explaination_history_id, timestamp)
      SELECT $[user_id], id, $[timestamp] FROM history RETURNING *
    )
    SELECT * FROM history, user_to_history;
    `, {user_id, result, filehash, q, usage, ...timestamp()});
    return ret;
  } catch (error) {
    error_handle(error);
    return false;
  }
  
}

const toggleShareState = async(user_id, text_explaination_history_id, is_share) => {
  const user_id_expression = user_id ? "user_id = $[user_id]" : "user_id IS NULL";
  try {
    const ret = await db.one(`UPDATE user_to_text_explaination_history SET is_share = $[is_share] WHERE text_explaination_history_id = $[text_explaination_history_id] AND ${user_id_expression} RETURNING *;
    `, {user_id, text_explaination_history_id, is_share});
    return ret;
  } catch (error) {
    error_handle(error);
    return false;
  }
}

module.exports = {
  insertTextToExplainationHistory,
  toggleShareState
}