const express = require("express");
const df = express.Router();
const fs = require('fs');
const {user_input_letter_and_numbers_only} = require('./str-filter');
const path = require('path');
//download client side localstorage init data
df.get("/download_localstorage_init", async (req, res) => {
  //check file exists and send it
  const file_path = `./client_localstorage_init.txt`;
  if(fs.existsSync(file_path)){
    res.send(fs.readFileSync(file_path));
  }else{
    res.status.json({});
  }
});

//download pdf thumbnail
df.get("/pdf_thumbnail/:fileHash", async (req, res) => {
  const fileHash = user_input_letter_and_numbers_only(req.params.fileHash);
  // combine path
  const file_path = path.join(__dirname, `/../text-files/${fileHash}/`, 'cover.1.png');
  try {
    //check file exists and send it
    if(fileHash !== false && fs.existsSync(file_path)){
      res.sendFile(file_path);
    }else throw("file not found");
  } catch (error) {
    res.status(404).send("file not found");
  }
})

///get pdf file meta data by hash
df.get("/meta/:fileHash", async (req, res) => {
  const fileHash = user_input_letter_and_numbers_only(req.params.fileHash);
  // combine path
  const file_path = path.join(__dirname, `/../text-files/${fileHash}/`, 'metadata.txt');
  try {
    //check file exists and change key name of the json object
    if(fileHash !== false && fs.existsSync(file_path)){
      const json = JSON.parse(fs.readFileSync(file_path));
      const field_exchange = {
        "originalname" : "name",
        "mimetype" : "type",
        "size" : "size"
      }
      let ret = {};
      for(let x in field_exchange) ret[field_exchange[x]] = json[x];
      res.json(ret);
    }else{
      throw("file not found");
    }
  } catch (error) {
    res.status(404).send("file not found");
  }
  /*
    lastModified:  1680656982986
    lastModifiedDate:  "2023-04-05T01:09:42.986Z"
    name: "oldmansea.pdf"
    size: 380238
    type: "application/pdf"
    webkitRelativePath: ""
    {"fieldname":"files","originalname":"oldmansea.pdf","encoding":"7bit","mimetype":"application/pdf","destination":"uploads/","filename":"16329a63f133a91c3a2d28d3161bef34","path":"uploads/16329a63f133a91c3a2d28d3161bef34","size":380238}
  */
})

//get alt img file by hash
df.get("/image/:fileHash", async (req, res) => {
  //filter user input
  const fileHash = user_input_letter_and_numbers_only(req.params.fileHash);
  // combine path
  const file_path = path.join(__dirname, `/../img-files/${fileHash}`);
  if(fileHash !== false && fs.existsSync(file_path)){
    res.sendFile(file_path);
  }else{
    res.status(404).send("file not found");
  }
})

//get pdf file content by hash
df.get("/:fileHash", async (req, res) => {
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