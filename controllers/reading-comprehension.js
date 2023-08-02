const express = require("express");
const rc = express.Router();
const {get_embedding, cosineDistance, embedding_result_templete, chatCompletion} = require('./wrapped-api');
const {
  insertReadingComprehensionChatHistory, 
  readReadingComprehensionHistory,
  addReadingComprehensionAnswerLinkToUser,
} = require('../queries/reading-comprehension');
const rcQuery = require('../queries/reading-comprehension');
const {log_user_action} = require('../queries/user-control');

const {user_input_filter} = require('./str-filter');
const [ max_token_for_embedding, max_token_for_completion ] = [5000, 2000];
//web api Entrance/////////////////////////////////////////
rc.post("/", async (req, res) => {
  //read from history first, if question asked before, pull the record,  
  ////
  
  //record api usage to db
  const {insert_to_api_usage} = require('../queries/api-usage');
  
  //reading body
  let {q, fileHash, level} = req.body;
  
  //check user input
  q = user_input_filter(q);
  const ret = await readReadingComprehensionHistory(fileHash, q, level);
  if(!ret){
    //read failed
    //no record then run the normal text embedding procedure
  }else{
    //record found
    const {userId} = req.session.userInfo;
    if(userId){
      //record found and login, Compare user id, if not the same add the document link under user
      
      //if this question not linked to current user, link it to current user
      if(userId !== ret.user_id){
        //link to user
        addReadingComprehensionAnswerLinkToUser(userId, ret.id);
        ret.is_share = true;
      }
    }else{
      //record found and no login, just return found record
    }
    //trim user_id from the found record and return 
    delete ret.user_id;
    res.json({data: ret});
    log_user_action(userId, 'user asking for question in reading comprehension', JSON.stringify(ret));
    return;
  }
  
  try {
    if(q === false || q.length < 4 || q.length > 512) throw new Error ("question invaild");
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
    if(embeddings === false) throw new Error("embeddings file not found");
    //getting the similarity and repack the asnwer related text to context
    const context = process_with_similarity(embedding_q, embeddings).map(el => el.text).join("\n");
    //sending out the completion request to openai
    const completion = await chatCompletion(q, context, max_token_for_completion, level);
    if(completion) {
      //if result is Legit
      const {id, usage, choices} = completion;
      // console.log("in reading comprehension", completion);
      completion['level'] = level;
      //save to history
      const rcHistory = await insertReadingComprehensionChatHistory(
        req.session.userInfo.userId,
        fileHash,
        q,
        level,
        completion,
        usage.total_tokens + embedding_q.usage.total_tokens
      );
      //if user not login, share this chat history
      if(req.session?.userInfo?.userId === undefined){
        rcQuery.toggleShareState(null, rcHistory.comprehension_history_id, true);
      }
      //remove user_id from result
      delete rcHistory.user_id;
      //return result
      res.json({data: rcHistory});
      //record api usage
      insert_to_api_usage({
        user_name: req.sessionID, 
        user_input: q, 
        caller: 'reading-comprehension-completion', 
        json: completion, 
        req_usage: usage.total_tokens,
        ip_address: req.socket.remoteAddress
      });
      log_user_action(req.session.userInfo.userId, 'user asking for question in reading comprehension and goes to the openai', JSON.stringify(ret));

    }
    else{
      throw new Error(completion.error.message);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
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
    console.error(error);
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