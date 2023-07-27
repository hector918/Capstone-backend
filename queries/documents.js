const db = require("./db-config");

const InsertDocumentLinkToUser = async(user_id, filehash) => {
  try {
    const json = {user_id, filehash, timestamp: new Date().toUTCString()};
    const ret = await db.one(`
      WITH selected_documents AS (
        SELECT id
        FROM documents
        WHERE documents.filehash = $[filehash]
      )
      INSERT INTO user_to_documents (user_id, document_id, timestamp)
      SELECT $[user_id], selected_documents.id, $[timestamp]
      FROM selected_documents
      RETURNING *;
    `, json)
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
}

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

const getDocumentsByUser = async(user_id) => {
  try {
    const ret = await db.many(`SELECT d.filehash, u.timestamp, u.is_share, u.is_favorite, u.order FROM user_to_documents u JOIN documents d ON u.document_id = d.id WHERE u.user_id = $[user_id];`, {user_id});
    console.log(ret);
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const removeDocumentFromUser = async(user_id, document_id) => {
  try {
    const ret = await db.one(`DELETE FROM user_to_documents WHERE user_id = $[user_id] and document_id = $[document_id] RETURNING id`, {user_id, document_id});
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
}
//////////////////////////////////////////////
module.exports = {
  insertDocument,
  removeDocumentFromUser,
  getDocumentsByUser,
  InsertDocumentLinkToUser
}