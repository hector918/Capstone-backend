const db = require("./db-config");
const ra = require("../controllers/reading-assistance.js");

const askAquestion = async (questionData) => {
  try {
    const newQuestion = await db.one(
      "INSERT INTO session (sid, sess, expire) VALUES($1, $2, $3) RETURNING *",
      [questionData.sid, questionData.sess, questionData.expire]
    );
    return newQuestion;
  } catch (error) {
    return error;
  }
};

module.exports = { askAquestion };
