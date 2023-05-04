const express = require("express");
const rc = express.Router();
const {get_embedding, cosineDistance, embedding_result_templete, chatCompletion} = require('./wrapped-api');
const [ max_token_for_embedding, max_token_for_completion ] = [2000, 2000];
//web api Entrance////////////////////////////////////////////////////
rc.get("/", async (req, res)=>{
  //
  res.send("get is not for you, use post instead");
})

rc.post("/", async (req, res)=>{
  //reading body
  const {q, filehash} = req.body;
  //error handling
  try {
    if(q === undefined || q.length < 2) throw "question invaild";
    //getting embedding of question
    const embedding_q = embedding_result_templete(q, await get_embedding(q));
    //reading related embedding file base on hash,
    const embeddings = process_addressing_file(filehash);
    if(embeddings === false) throw "file not found";
    //getting the similarity and repack the asnwer related text to context
    const context = process_with_similarity(embedding_q, embeddings).map(el => el.text).join("\n");
    //sending out the completion request to openai
    const completion = await chatCompletion(q, context, max_token_for_completion);
    //if result is Legit
    if(completion) {
      const {id, usage, choices} = completion;
      console.log(usage, choices);
      //respond
      res.send(JSON.stringify(completion));
    }
    else{
      res.send(JSON.stringify({result:"something went wrong, contact admin"}));
    }
  } catch (error) {
    console.log(error);
    res.send(JSON.stringify({result:"failed", error}));
  }
})
///helper section///////////////////////////////////////////////////
function process_addressing_file(filehash){
  const fs = require("fs");
  const folder_path = `${__dirname}/../text-files/${filehash}`;
  const embedding_filename = `${folder_path}/embedding-${filehash}.json`;
  //check file exists
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
  //Create a context for a question by finding the most similar context from the dataframe
  embeddings = embeddings.map(({text, usage, embedding})=>{
    return {text, usage, embedding, similarity: cosineDistance(question_embedding.embedding, embedding)};
  })
  //sort the embeddings
  embeddings.sort((a, b)=> a.similarity > b.similarity ? -1 : 1 );
  let [cur_len, cur_pointer] = [0, 0];
  //picking anwer related text
  for(let x of embeddings){
    cur_len += x.usage.total_tokens;
    if(cur_len > max_token_for_embedding) break;
    cur_pointer++;
  }
  return embeddings.slice(0, cur_pointer);
}

module.exports = rc;