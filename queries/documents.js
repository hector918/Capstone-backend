const db = require("./db-config");

const insertDocument = async(user_id, filehash) => {
  try {
    const ret = await db.one(`
      WITH inserted_row AS (
        INSERT INTO documents (filehash, timestamp, uploader)
        VALUES ($[filehash], $[timestamp], $[user_id])
        ON CONFLICT (filehash)
        DO UPDATE SET filehash = EXCLUDED.filehash
        RETURNING id
      )
      INSERT INTO user_to_documents (user_id, document_id, timestamp)
      SELECT $[user_id], id, $[timestamp] FROM inserted_row RETURNING *;
    `,{user_id, filehash, timestamp: new Date().toUTCString()});
    console.log(ret);
  } catch (error) {
    console.error(error);

  }
}

const removeDocumentFromUser = async(user_id, document_id) => {
  try {
    const ret = await db.one(`DELETE FROM user_to_documents WHERE user_id = $[user_id] and document_id = $[document_id] RETURNING id`, {user_id, document_id});
    console.log(ret);
  } catch (error) {
    console.error(error);
  }
}
//////////////////////////////////////////////
module.exports = {
  insertDocument,
  removeDocumentFromUser,
}