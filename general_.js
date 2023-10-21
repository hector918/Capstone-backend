const fs = require("fs");
//////////////////////////////////////////
function readFileSyncWithLimit(file_path, size_limit = 10_000_000) {
  try {
    const { size } = fs.statSync(file_path);
    if (size > size_limit) throw new Error(`file: ${file_path} over size`);
    const content = fs.readFileSync(file_path, 'utf8');
    return content;
  } catch (error) {
    console.error(error);
    return false
  }
}
function responseSendFile(response, file_path, size_limit = 10_000_000) {
  try {
    const { size } = fs.statSync(file_path);
    if (size > size_limit) throw new Error(`file: ${file_path} over size`);
    response.sendFile(file_path);
    return true;
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
    return false;
  }
}

module.exports = {
  readFileSyncWithLimit,
  responseSendFile
}