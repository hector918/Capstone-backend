const express = require("express");
const rc = express.Router();
const {get_embedding, cosineDistance, embedding_result_templete, chatCompletion} = require('./wrapped-api');
const {user_input_filter} = require('./str-filter');
const [ max_token_for_embedding, max_token_for_completion ] = [5000, 2000];
//web api Entrance////////////////////////////////////////////////////

rc.post("/", async (req, res)=>{
  //record api usage to db
  const {insert_to_api_usage} = require('../queries/api-usage');
  
  //reading body
  let {q, fileHash, level} = req.body;
  //check user input
  q = user_input_filter(q);
  //error handling
  
  try {
    if(q === false || q.length < 4 || q.length > 512) throw "question invaild";
    //getting embedding of question
    const embedding_q = embedding_result_templete(q, await get_embedding(q));
    //record api usage
    insert_to_api_usage({
      user_name: req.sessionID, 
      user_input: q, 
      caller: 'reading-comprehension-embedding', 
      json: {}, 
      req_usage: embedding_q.usage.total_tokens,
      ip_address: req.socket.remoteAddress
    });
    //reading related embedding file base on hash,
    const embeddings = process_addressing_file(fileHash);
    if(embeddings === false) throw "embeddings file not found";
    //getting the similarity and repack the asnwer related text to context
    const context = process_with_similarity(embedding_q, embeddings).map(el => el.text).join("\n");
    //sending out the completion request to openai
    const completion = await chatCompletion(q, context, max_token_for_completion, level);
    //if result is Legit
    
    if(completion) {
      const {id, usage, choices} = completion;
      console.log("in reading comprehension", completion);
      //respond
      completion['level'] = level;
      res.send(JSON.stringify(completion));
      //record api usage
      insert_to_api_usage({
        user_name: req.sessionID, 
        user_input: q, 
        caller: 'reading-comprehension-completion', 
        json: completion, 
        req_usage: usage.total_tokens,
        ip_address: req.socket.remoteAddress
      });
    }
    else{
      throw new Error("completion = false");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(JSON.stringify({result:"failed", error}));
  }
})
///helper section///////////////////////////////////////////////////
function process_addressing_file(filehash){
  const fs = require("fs");
  // preparing file name and path
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
  embeddings = embeddings.map(({text, usage, embedding}) => {
    return {text, usage, embedding, similarity: cosineDistance(question_embedding.embedding, embedding)};
  })
  //sort embeddings with similarity
  embeddings.sort((a, b) => a.similarity > b.similarity ? -1 : 1 );
  let [cur_len, cur_pointer] = [0, 0];
  //picking answer from related text
  for(let x of embeddings){
    cur_len += x.usage.total_tokens;
    if(cur_len > max_token_for_embedding) break;
    cur_pointer++;
  }
  return embeddings.slice(0, cur_pointer);
}

module.exports = rc;