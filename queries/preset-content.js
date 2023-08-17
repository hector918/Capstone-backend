const db = require("./db-config");

const InsertPresetContent = async(name, content) => {
  try {
    const ret = await db.one(`
      INSERT INTO preset_content (name, content)
      VALUES ($[name], $[content])
      ON CONFLICT (name)
      DO UPDATE SET content = $[content] RETURNING *;
    `, {name, content});
    console.log(ret);
    return ret;
  } catch (error) {
    console.error(error);
    return false;
  }
}

const getPresetContetntByName = async(name) => {
  try {
    //if in the memory, then pull from memory, else pull from database
    const ret = await db.one(`SELECT * FROM preset_content WHERE name = $[name]`, {name});
    console.log(ret);
    
  } catch (error) {
    console.error(error);
    return false;
  }
}

module.exports = {
  InsertPresetContent,
  getPresetContetntByName
}