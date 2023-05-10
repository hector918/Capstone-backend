const express = require("express");
const df = express.Router();
const fs = require('fs');
const {user_input_letter_and_numbers_only} = require('./str-filter');
const path = require('path');

df.get("/:fileHash", async (req, res)=>{
  const fileHash = user_input_letter_and_numbers_only(req.params.fileHash);
  // const processed_file_path = `${__dirname}/../text-files/`;
  const file_path = path.join(__dirname, `/../text-files/${fileHash}/`, fileHash);
  if(fileHash !== false && fs.existsSync(file_path)){
    res.sendFile(file_path);
  }else{
    res.status(404).send("file not found");
  }
});

module.exports = df;