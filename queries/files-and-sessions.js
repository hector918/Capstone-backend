const db = require("../db/dbConfig.js");


// const updateFile = async (filehash, embedding_path) => {
//   // const { name, time } = album;
//   try {
//     const newFile = await db.one(
//       `UPDATE albums SET name=$[name], time=$<time> WHERE id=$[id] RETURNING *`,
//       { name, time, id }
//     );
//     return newFile;
//   } catch (error) {
//     throw error;
//   }
// };