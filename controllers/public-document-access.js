const express = require("express");
const pda = express.Router();
const {user_input_letter_and_numbers_only} = require('./str-filter');
const docLocalPath = '../text-files';

pda.post("/list", async (req, res) => {
  try {
    //reading body
    // let {type} = req.body;
    const file_path = path.join(__dirname, `${docLocalPath}`);
    const {folderList} = getAllFiles(file_path);
    const retList = [];
    folderList.forEach(el => {
      if (checkDocumentAvialable(el)){
        let fileHash = el.split("/").pop();
        retList.push(getMetaDataByHash(fileHash));
      } 
    })
    res.json({popular: retList, favorite: retList, collection: retList});
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

pda.get('/pdf_thumbnail/:fileHash', async (req, res) => {
  const fileHash = user_input_letter_and_numbers_only(req.params.fileHash);
  // combine path
  const file_path = path.join(__dirname, `/../text-files/${fileHash}`);
  try {
    //check file exists and send it
    const coverPath = `${file_path}/cover.1.png`;
    //if cover not exists send default
    const defaultCoverPath = path.join(__dirname, '../img-files', "binarymindlogorectangle");
    if(fileHash !== false && fs.existsSync(coverPath)){
      res.sendFile(coverPath);
    }else if(fs.existsSync(defaultCoverPath)){
      res.sendFile(defaultCoverPath);
    }else throw("file not found");

  } catch (error) {
    console.log(error);
    //if default not exists send 404
    res.status(404).send("file not found");
  }
});

////////////////////////////////////////
const fs = require('fs');
const path = require('path');

function getMetaDataByHash(fileHash){
  const ret = {fileHash, meta: {}, history: {}};
  const file_path = path.join(__dirname, docLocalPath, fileHash);
  ///add meta text
  if(fs.existsSync(`${file_path}/metadata.txt`)){
    const field_exchange = {
      "originalname" : "name",
      "mimetype" : "type",
      "size" : "size"
    }
    const meta = JSON.parse(fs.readFileSync(`${file_path}/metadata.txt`));
    for(let x in field_exchange) ret.meta[field_exchange[x]] = meta[x];
  }
  
  return ret;
}

function getAllFiles(dirPath) {
  //loop path, feedback folders and files in that path, sub folder are not included
  const files = fs.readdirSync(dirPath);
  const [fileList, folderList] = [[], []];
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      folderList.push(filePath);
    } else {
      fileList.push({filePath, size: stat.size});
    }
  });
  return {fileList, folderList};
}

function checkDocumentAvialable(folderPath){
  
  const {fileList} = getAllFiles(folderPath);
  for(let file of fileList){
    switch(path.extname(file.filePath)){
      case ".json":
        //if it's a embedding
        if(path.basename(file.filePath).startsWith('embedding')) {
          //check embedding's size, if less than 1 return false
          if(file.size < 1) return false;
        }
      break;
      case "":
        // if pdf file less than 1 byte return false
        if(file.size < 1) return false;
      break;
      case ".usage":
        //if token usage less than 1 return false
        if(Number(path.basename(file.filePath).split(".")[0]) < 1) return false;
      break;
    }
  }
  return true;
}

module.exports = pda;