const express = require("express");
const pda = express.Router();
const { user_input_letter_and_numbers_only } = require('./str-filter');
const docLocalPath = '../text-files';
const path = require('path');
const fs = require('fs');
const { getAllHistoryFromFileHash } = require('../queries/documents');
const { getPresetContetntByName } = require('../queries/preset-content');
const { readFileSyncWithLimit, responseSendFile } = require('../general_');

pda.get("/list", async (req, res) => {
  try {
    console.log("in pda list", req.headers.host);
    //reading body
    // let {type} = req.body;

    //read from file system
    // const file_path = path.join(__dirname, `${docLocalPath}`);
    // const {folderList} = getAllFiles(file_path);
    // const retList = [];
    // folderList.forEach(el => {
    //   if (checkDocumentAvialable(el)){
    //     let fileHash = el.split("/").pop();
    //     retList.push(getMetaDataByHash(fileHash));
    //   } 
    // })
    // res.json({"data": {popular: retList, favorite: retList, collection: retList, timestamp: new Date()}});
    //
    const ret = (await getPresetContetntByName("preset-moving-gallery"));
    res.json({ data: ret.content['preset-moving-gallery'] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: req.trans(error.message) });
  }
});

pda.get('/pdf_thumbnail/:fileHash', async (req, res) => {
  const fileHash = user_input_letter_and_numbers_only(req.params.fileHash);
  // combine path
  const file_path = path.join(__dirname, `/../text-files/${fileHash}`);
  try {
    //check file exists and send it
    const coverPath = `${file_path}/cover.jpg`;
    //if cover not exists send default
    const defaultCoverPath = path.join(__dirname, '../img-files', "binarymindlogorectangle");
    if (fileHash !== false && fs.existsSync(coverPath)) {
      responseSendFile(res, coverPath);
    } else if (fs.existsSync(defaultCoverPath)) {
      responseSendFile(res, defaultCoverPath);
    } else throw ("file not found");

  } catch (error) {
    console.log(error);
    //if default not exists send 404
    res.status(404).send(req.trans('file not found.'));
  }
});

///get pdf file meta data by hash
pda.get("/meta/:fileHash", async (req, res) => {
  try {
    const fileHash = user_input_letter_and_numbers_only(req.params.fileHash);
    const { meta } = getMetaDataByHash(fileHash);
    if (meta['name'] !== undefined) {
      res.json(meta);
    } else throw new Error("file not found");
  } catch (error) {
    res.status(404).json({ error: req.trans(error.message) });
  }
});

//get pdf file content by hash
pda.get("/:fileHash", async (req, res) => {
  const fileHash = user_input_letter_and_numbers_only(req.params.fileHash);
  // const processed_file_path = `${__dirname}/../text-files/`;
  const file_path = path.join(__dirname, `/../text-files/${fileHash}/`, fileHash);
  if (fileHash !== false && fs.existsSync(file_path)) {
    responseSendFile(res, file_path);
  } else {
    res.status(404).send("file not found");
  }
});

pda.get('/chathistory/:filehash', async (req, res) => {
  try {
    const fileHash = user_input_letter_and_numbers_only(req.params.filehash);
    //if filehash not correct, return empty array
    if (fileHash === undefined || fileHash.length < 64) {
      res.json({ data: [] });
      return;
    }
    const userId = req.session?.userInfo?.userId;
    const ret = await getAllHistoryFromFileHash(userId, fileHash);
    res.json({ data: ret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});
////////////////////////////////////////
function getDocumentChatHistory(fileHash) {

}
function getMetaDataByHash(fileHash) {
  const ret = { fileHash, meta: {}, history: {} };
  const file_path = path.join(__dirname, docLocalPath, fileHash);
  ///read meta text
  if (fs.existsSync(`${file_path}/metadata.txt`)) {
    //only show selected fields
    const field_exchange = {
      "originalname": "name",
      "mimetype": "type",
      "size": "size"
    }
    const meta = JSON.parse(readFileSyncWithLimit(`${file_path}/metadata.txt`));
    for (let x in field_exchange) ret.meta[field_exchange[x]] = meta[x];
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
      fileList.push({ filePath, size: stat.size });
    }
  });
  return { fileList, folderList };
}

function checkDocumentAvialable(folderPath) {
  const { fileList } = getAllFiles(folderPath);
  for (let file of fileList) {
    switch (path.extname(file.filePath)) {
      case ".json":
        //if it's a embedding
        if (path.basename(file.filePath).startsWith('embedding')) {
          //check embedding's size, if less than 1 return false
          if (file.size < 1) return false;
        }
        break;
      case "":
        // if pdf file less than 1 byte return false
        if (file.size < 1) return false;
        break;
      case ".usage":
        //if token usage less than 1 return false
        if (Number(path.basename(file.filePath).split(".")[0]) < 1) return false;
        break;
    }
  }
  return true;
}

module.exports = { pda, getMetaDataByHash };