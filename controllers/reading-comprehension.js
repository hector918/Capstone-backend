const express = require("express");
const rc = express.Router();
const {get_embedding, cosineDistance, embedding_result_templete} = require('./wrapped-api');


rc.get("/", async (req, res)=>{

  console.log("testing in rc", req.session);
  res.send("Dsads")
})

rc.post("/", async (req, res)=>{
  const {q, filehash} = req.body;
  if(q === undefined || q.length < 2) return;
  let embedding_q = await get_embedding(q);
  try {
    // reorganize result
    embedding_q = embedding_result_templete(q, embedding_q);
    // embedding_q = {text: q, usage: embedding_q.usage, embedding: embedding_q.data[0].embedding};
  } catch (error) {
    res.send({result:"failed", message:"api access failed"});
  }
  let embeddings = process_addressing_file(filehash);
  console.log(embedding_q)
  process_with_similarity(embedding_q, embeddings);
  
  //respond
  res.send("1231312");
})

function process_addressing_file(filehash){
  const fs = require("fs");
  const folder_path = `${__dirname}/../text-files/${filehash}`;
  const embedding_filename = `${folder_path}/embedding-${filehash}.json`;
  if(!fs.existsSync(folder_path) || !fs.existsSync(embedding_filename)) return false;
  try {
    return JSON.parse(fs.readFileSync(embedding_filename));
  } catch (error) {
    console.log(error);
    return false;
  }
}

function process_with_similarity(question_embedding, embeddings){
  if(!question_embedding || !embeddings) return false;
  const context_arr = [];
  let cur_len = 0;
  //Create a context for a question by finding the most similar context from the dataframe
  embeddings = embeddings.map(({text, usage, embedding})=>{
    let similarity = cosineDistance(question_embedding.embedding, embedding);
    console.log(similarity);
    return {text, usage, embedding, similarity};
  })
  console.log(question_embedding.length, question_embedding)

  // for(const {text, usage, embedding} of embeddings){

  // }
}
module.exports = rc;