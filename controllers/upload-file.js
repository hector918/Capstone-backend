const express = require("express");
const uf = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const crypto = require('crypto');
const fs = require('fs');
//////////////////////////////////////////////////////
uf.post("/", upload.array("files"), async (req, res)=>{
  if(req.files?.length > 0){
    let ret = await process_file(req.files[0].path, req.files[0]);
    res.json({...ret, message: "Successfully uploaded files" });
  }else{
    res.json({message: "no file receive" });
  }
});
//////////////////////////////////////////////////////
async function process_file(filepath, meta_data){
  const processed_file_path = `${__dirname}/../text-files/`;
  const filecontent = fs.readFileSync(`${__dirname}/../${filepath}`);
  const fileHash = crypto.createHash('sha256').update(filecontent).digest('hex');

  if(fs.existsSync(`${processed_file_path}${fileHash}`)){
    //if exists
    fs.unlinkSync(filepath);
    return {result:"sucess", fileHash};
  }else{
    //if not exists
    fs.mkdirSync(`${processed_file_path}${fileHash}`);
    fs.renameSync(filepath, `${processed_file_path}${fileHash}/${fileHash}`);
    fs.writeFileSync(`${processed_file_path}${fileHash}/metadata.txt`, JSON.stringify(meta_data));
    let text;
    switch(meta_data.mimetype){
      case 'application/pdf':
        text = await pdf2text(`${processed_file_path}${fileHash}/${fileHash}`);
      break;
      default: // treat as text file
        text = fs.readFileSync(`${processed_file_path}${fileHash}/${fileHash}`, 'utf8')
    }
    //next split text
    const text_arr = text_splitter(text, 2000, 100, str => str.replace(/[\n\s]+/g, " "));
    const {get_embedding} = require('./wrapped-api');
    //embedding
    let total_usage = 0;
    const embedding = await Promise.all(text_arr.map(async el => {
      let data = await get_embedding(el);
      total_usage += data.usage.total_tokens;
      return {text: el, usage: data.usage, embedding: data.data[0].embedding};
    }));
    //to file
    fs.writeFileSync(`${processed_file_path}${fileHash}/${total_usage}.usage`, "");
    fs.writeFileSync(`${processed_file_path}${fileHash}/embedding.json`, JSON.stringify(embedding));
    return {result: "sucess", usage: total_usage, fileHash};
  }
}

async function pdf2text(filepath){
  const content = fs.readFileSync(filepath);
  let ret = await require('pdf-parse')( content );
  return ret.text || false;
}

function text_splitter(target_content, chunk_size = 1000, chunk_over_lap = 100, filter_function){
  if(target_content===undefined) return false;
  let text_pointer = 0;
  let ret = [];
  while(text_pointer < target_content.length){
    let this_chunk_end = Math.min(text_pointer + chunk_size, target_content.length);
    let tmp = target_content.slice(text_pointer, this_chunk_end);
    ret.push(filter_function ? filter_function(tmp) : tmp);
    text_pointer = this_chunk_end === target_content.length ? this_chunk_end : this_chunk_end - chunk_over_lap;
  }
  return ret;
}

module.exports = uf;