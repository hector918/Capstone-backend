const express = require("express");
const uf = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const crypto = require('crypto');
const fs = require('fs');
uf.post("/", upload.array("files"), (req, res)=>{
  process_file(req.files[0].path);
  res.json({ message: "Successfully uploaded files" });
});

function process_file(filepath){
  const processed_file_path = `${__dirname}/../text-files/`;
  const filecontent = fs.readFileSync(`${__dirname}/../${filepath}`);
  const fileHash = crypto.createHash('sha256').update(filecontent).digest('hex');

  if(fs.existsSync(`${processed_file_path}${fileHash}`)){
    //if exists
    fs.unlink(filepath);

  }else{
    fs.mkdirSync(`${processed_file_path}${fileHash}`);
    fs.renameSync(filepath, `${processed_file_path}${fileHash}/${fileHash}`);

    //if not exists
  }
  console.log(fileHash);
}

module.exports = uf;