const db = require("./db-config");
const timestamp = ()=> ({timestamp: new Date().toUTCString()});
const insertReadingComprehensionChatHistory = async(user_id, filehash, q, level, result, usage) => {
  try {
    const ret = await db.one(`
    WITH history AS (
      INSERT INTO reading_comprehension_chat_history (q, result, timestamp, filehash, usage, level)
      VALUES ($[q], $[result], $[timestamp], $[filehash], $[usage], $[level])
      RETURNING *
    ),
    user_to_history AS (
      INSERT INTO user_to_comprehension_history (user_id, comprehension_history_id, timestamp)
      SELECT $[user_id], id, $[timestamp] FROM history RETURNING *
    )
    SELECT * FROM history, user_to_history;
    `, {user_id, result, filehash, q, level, usage, timestamp: new Date().toUTCString()});
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }

  /* example successful output
    {
      id: 5,
      q: 'what is this story about?',
      result: {
        id: 'chatcmpl-7hesZejOJ5038VMuEy3x6j1yO5uCO',
        object: 'chat.completion',
        created: 1690639599,
        model: 'gpt-3.5-turbo-16k-0613',
        choices: [ [Object] ],
        usage: { prompt_tokens: 4911, completion_tokens: 91, total_tokens: 5002 },
        level: '2'
      },
      timestamp: 2023-07-29T18:06:41.000Z,
      filehash: '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef',
      usage: 5008,
      level: '2',
      user_id: 'bbbb',
      comprehension_history_id: 10,
      is_share: false
    }
  */

}
const addReadingComprehensionAnswerLinkToUser = async(user_id, comprehension_history_id) => {
  try {
    const body = {
      user_id, 
      comprehension_history_id,
      ...timestamp()
    }
    await db.none(`INSERT INTO user_to_comprehension_history 
      (user_id, comprehension_history_id, timestamp) 
      VALUES 
      ($[user_id], $[comprehension_history_id], $[timestamp]);`
    , body);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const readReadingComprehensionHistory = async(filehash, q, level) => {
  try {
    const ret = await db.oneOrNone(`
    SELECT 
      rh.*, uh.user_id, uh.is_share, uh.timestamp
    FROM reading_comprehension_chat_history AS rh
    LEFT JOIN user_to_comprehension_history AS uh ON
      uh.comprehension_history_id = rh.id 
    WHERE filehash = $[filehash] AND q = $[q] AND level = $[level]`, {filehash, q, level});
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
  /* exmaple successful output
    {
      id: 8,
      q: 'what is this story about?',
      result: {
        id: 'chatcmpl-7hQMEvEs0nh9HQv67ctXGIG8NaL07',
        object: 'chat.completion',
        created: 1690583778,
        model: 'gpt-3.5-turbo-16k-0613',
        choices: [ [Object] ],
        usage: { prompt_tokens: 4911, completion_tokens: 91, total_tokens: 5002 },
        level: '2'
      },
      timestamp: 2023-07-29T02:36:19.000Z,
      filehash: '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef',
      usage: 5008,
      level: '2',
      user_id: 'bbbb',
      is_share: false
    }  
   */  
}

const toggleShareState = async(user_id, comprehension_history_id, is_share) => {
  try {
    const ret = await db.one(`UPDATE user_to_comprehension_history SET is_share = $[is_share] WHERE comprehension_history_id = $[comprehension_history_id] AND user_id = $[user_id] RETURNING *;
    `, {user_id, comprehension_history_id, is_share});
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = {
  insertReadingComprehensionChatHistory,
  addReadingComprehensionAnswerLinkToUser,
  readReadingComprehensionHistory,
  toggleShareState
}