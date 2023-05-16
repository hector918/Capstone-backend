const express = require("express");
const uf = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const crypto = require('crypto');
const fs = require('fs');

//express operation enterance////////////////////////////////////////////////////
uf.post("/", upload.array("files"), async (req, res)=>{
  if(req.files?.length > 0){
    //only process first file from req 
    let ret = await process_file(req.files[0].path, req.files[0]);
    //respond
    res.json({...ret, message: "Successfully uploaded"});

    if(ret["usage"]){//if file is new uploaded
      //record api usage to db
      const {insert_to_api_usage} = require('../queries/api-usage');
      insert_to_api_usage({user_name:req.sessionID, user_input:req.files[0].originalname, caller:'upload-file-embedding', json:{filehash: ret.fileHash}, req_usage:ret.usage});
    }
  }else{
    res.json({message: "no file receive" });
  }
});
//////////////////////////////////////////////////////
async function process_file(filepath, meta_data){
  const processed_file_path = `${__dirname}/../text-files/`;
  const filecontent = fs.readFileSync(`${__dirname}/../${filepath}`);
  //create file hash
  const fileHash = crypto.createHash('sha256').update(filecontent).digest('hex');

  if(fs.existsSync(`${processed_file_path}${fileHash}`)){
    //if exists
    fs.unlinkSync(filepath);
    return {result:"success", fileHash};
  }else{
    //if not exists
    //making folder
    fs.mkdirSync(`${processed_file_path}${fileHash}`);
    //move the file from upload to the folder named by filehash
    fs.renameSync(filepath, `${processed_file_path}${fileHash}/${fileHash}`);
    //save the metadata 
    fs.writeFileSync(`${processed_file_path}${fileHash}/metadata.txt`, JSON.stringify(meta_data));
    let text;
    //checking file type
    switch(meta_data.mimetype){
      case 'application/pdf':
        text = await pdf2text(`${processed_file_path}${fileHash}/${fileHash}`);
      break;
      default: // treat as text file
        text = fs.readFileSync(`${processed_file_path}${fileHash}/${fileHash}`, 'utf8')
    }
    //next split text
    const text_arr = text_splitter(text, 700, 100, str => str.replace(/[\n\s]+/g, " "));
    //embedding
    const {get_embedding, embedding_result_templete} = require('./wrapped-api');
    let total_usage = 0;
    const embedding = await Promise.all(text_arr.map(async el => {
      let data = await get_embedding(el);
      total_usage += data.usage.total_tokens;
      return embedding_result_templete(el, data);
    }));
    //to file
    //save usage to folder
    fs.writeFileSync(`${processed_file_path}${fileHash}/${total_usage}.usage`, "");
    //save embedding to folder
    fs.writeFileSync(`${processed_file_path}${fileHash}/embedding-${fileHash}.json`, JSON.stringify(embedding));
    return {result: "success", usage: total_usage, fileHash};
  }
}

async function pdf2text(filepath){
  //read file into memory
  const content = fs.readFileSync(filepath);
  //parse the pdf to text
  let ret = await require('pdf-parse')( content );
  //return the text
  return ret.text || false;
}

function text_splitter(target_content, chunk_size = 1000, chunk_over_lap = 100, filter_function){
  if(target_content === undefined) return false;
  let text_pointer = 0;
  let ret = [];
  //spliting the text
  while(text_pointer < target_content.length){
    //pinpoint end of the chunk
    let this_chunk_end = Math.min(text_pointer + chunk_size, target_content.length);
    //slice the chunk
    let chunk = target_content.slice(text_pointer, this_chunk_end);
    //save the chunk to array
    ret.push(filter_function ? filter_function(chunk) : chunk);
    //move the pointer
    text_pointer = this_chunk_end === target_content.length ? this_chunk_end : this_chunk_end - chunk_over_lap;
  }
  return ret;
}

module.exports = uf;