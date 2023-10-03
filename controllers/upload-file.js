const express = require("express");
const uf = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { verifyUserLogin } = require('./user-control');
const { insertDocument } = require('../queries/documents');
const { accept_file_only } = require('./str-filter');
const pdf_pages_limit = 2000;
const processed_file_path = `${__dirname}/../text-files/`;
//express operation enterance//////////////////////////////
uf.post("/", upload.array("files"), verifyUserLogin, async (req, res) => {
  try {
    if (req.files?.length > 0) {
      //only process first file from req 
      let ret = await process_file(accept_file_only(req.files[0].path), req.files[0]);
      //respond
      if (!ret.error) {

        const db_ret = await insertDocument(req.session.userInfo.userId, ret.fileHash);
        res.json({
          filehash: ret.fileHash,
          ...db_ret,
          type: ret.type,
          size: ret.size,
          message: "Successfully uploaded"
        });
        console.log("file uploaded", ret);
      } else {
        res.status(400).json({ ...ret });
      }

      if (ret["usage"]) {//if file is new uploaded
        //record api usage to db
        const { insert_to_api_usage } = require('../queries/api-usage');
        insert_to_api_usage({
          user_name: req.sessionID,
          user_input: req.files[0].originalname,
          caller: 'upload-file-embedding',
          json: { filehash: ret.fileHash },
          req_usage: ret.usage,
          ip_address: req.socket.remoteAddress
        });
      }
    } else {
      throw new Error(req.trans("no file receive"));
    }
  } catch (error) {
    res.status(500).json({ "error": error.message });
  }

  //////////////////////////////////////////////////////
  async function process_file(filepath, meta_data) {
    // //remove old man and the sea
    // removeOldman()
    //////////////////////////////
    // console.log("in process file");
    filepath = accept_file_only(filepath);
    const filecontent = fs.readFileSync(`${__dirname}/../${filepath}`);
    //create file hash
    const fileHash = crypto.createHash('sha256').update(filecontent).digest('hex');

    if (fs.existsSync(`${processed_file_path}${fileHash}/${fileHash}`)) {
      //if exists
      fs.unlinkSync(filepath);
      return { result: "success", fileHash };
    } else {
      //if not exists
      //making folder
      if (!fs.existsSync(`${processed_file_path}${fileHash}`)) fs.mkdirSync(`${processed_file_path}${fileHash}`);
      //move the file from upload to the folder named by filehash
      fs.renameSync(filepath, `${processed_file_path}${fileHash}/${fileHash}`);
      //save the metadata 
      fs.writeFileSync(`${processed_file_path}${fileHash}/metadata.txt`, JSON.stringify(meta_data));
      let text = false;
      //checking file type
      const pdf_file_path = `${processed_file_path}${fileHash}/${fileHash}`;
      try {
        //extract text from document
        switch (meta_data.mimetype) {
          case 'application/pdf':
            const pages = await extractPDFContent(pdf_file_path);
            if (!pages) throw new Error(`make sure it's a text pdf and less than ${pdf_pages_limit} pages`);
            text = extractPureText(pages);
            break;
          default: // treat as text file
          // text = fs.readFileSync(pdf_file_path, 'utf8')
        }
        //check text result
        if (text === false) throw new Error("read text from file failed");
      } catch (error) {
        console.error(error);
        //text are false remove file
        fs.unlinkSync(`${processed_file_path}${fileHash}/metadata.txt`);
        fs.unlinkSync(`${processed_file_path}${fileHash}/${fileHash}`);
        return { error: error.message };
      }
      //next create text embedding - step one - split text
      const text_arr = text_splitter(text, 800, 100, str => str.replace(/[\n\s]+/g, " "));
      //embedding
      const { get_embedding, embedding_result_templete } = require('./wrapped-api');
      let total_usage = 0;
      const embedding = await Promise.all(text_arr.map(async el => {
        try {
          let data = await get_embedding(el);
          // console.log(data);
          total_usage += data.usage.total_tokens;
          return embedding_result_templete(el, data);
        } catch (error) {
          console.error(error);
          return { error };
        }

      }));
      //to file
      //save usage to folder
      fs.writeFileSync(`${processed_file_path}${fileHash}/${total_usage}.usage`, "");
      //save embedding to folder
      fs.writeFileSync(`${processed_file_path}${fileHash}/embedding-${fileHash}.json`, JSON.stringify(embedding));
      return {
        result: "success",
        usage: total_usage,
        fileHash,
        type: meta_data.mimetype,
        size: meta_data.size
      };
    }
  }
  function extractPureText(pages) {
    let pureText = "";
    try {
      for (let { text } of pages) text.items.forEach(({ str }) => {
        pureText += str;
      })
      return pureText;
    } catch (error) {
      console.error("in get pure text", error);
      return false;
    }
  }
  function removeOldman() {
    // for debug purposes
    fs.rm(`${processed_file_path}0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef`, { recursive: true }, (err) => {
      if (err) {
        console.error('Error removing folder:', err);
      } else {
        console.log('Folder removed successfully!');
      }
    });
  }
  async function extractPDFContent(file_path) {
    const PDFJS = require('pdfjs-dist');
    const doc = await PDFJS.getDocument(file_path).promise;
    const ret = [];
    // pdf pages more then pdf_pages_limit than return false
    if (doc.numPages > pdf_pages_limit) return false;
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      ret.push(await parsePage(page));
      //save first page
      if (p === 1) saveCover(page);
    }
    return ret;
    /////////////////////////////////////////
    function saveCover(page) {
      const path = require('path');
      var Canvas = require('canvas');
      // const canvas = Canvas.createCanvas(560, 792);
      let viewport = page.getViewport({ scale: 1.5 });
      const canvas = Canvas.createCanvas(viewport.width, viewport.height);
      let renderContext = {
        canvasContext: canvas.getContext('2d'),
        viewport
      };
      //get file path
      // const pdf_imgs_dir = path.resolve(path.dirname(file_path)) + "/imgs";
      // if(!fs.existsSync(pdf_imgs_dir)) fs.mkdirSync(pdf_imgs_dir);
      const pdf_imgs_dir = path.resolve(path.dirname(file_path));
      page.render(renderContext).promise.then(function () {
        fs.writeFileSync(
          pdf_imgs_dir + '/cover.jpg',
          canvas.toBuffer("image/jpeg"),
          console.error
        );
      });
    }
    /////////////////////////////////////////////////
    async function parsePage(page) {
      const imgs = [];
      const { fnArray, argsArray } = await page.getOperatorList();
      argsArray.forEach(async (arg, i) => {
        if (fnArray[i] === PDFJS.OPS.paintImageXObject) {
          try {
            let img = await page.objs.get(arg[0]);
            imgs.push(img);
          } catch (error) {
            console.error(error);
          }
        }
      });
      const text = await page.getTextContent();
      return { imgs, text };
    }
  }

  function text_splitter(target_content, chunk_size = 1000, chunk_over_lap = 100, filter_function) {
    if (target_content === undefined) return false;
    let text_pointer = 0;
    let ret = [];
    //spliting the text
    while (text_pointer < target_content.length) {
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
});

// uf.get('/checkFileExists/:fileHash', async(req, res) => {
//   try {
//     const {fileHash} = req.params;

//     console.log("in check file exists", fs.existsSync(`${processed_file_path}${fileHash}`));
//     res.json({});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({error: error.message});
//   }
// });


module.exports = uf;