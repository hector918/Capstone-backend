const express = require("express");
const ra = express.Router();
const { get_an_image, explainText, get_translation } = require('./wrapped-api');
const {user_input_filter} = require('./str-filter');
const {insert_to_api_usage} = require('../queries/api-usage');

ra.post("/translation", async (req, res) => {
  try {
    let {q, language, level} = req.body;
    //pre filter the user input
    question = user_input_filter(q);
    //stop when question invaild
    if(question === false || question.length < 4 || question.length > 10000) throw "invaild question";
    //get completion
    const completion = await get_translation(q, language, level);
    if(completion){
      const {id, usage, choices} = completion;
      console.log(completion);
      completion['level'] = level;
      //respond
      res.send(JSON.stringify(completion));
      //record api usage
      insert_to_api_usage({
        user_name: req.sessionID, 
        user_input: q, 
        caller: 'reading-assistance-translate-text', 
        json: completion,
        req_usage: usage.total_tokens,
        ip_address: req.socket.remoteAddress
      });
    }else{
      res.send(JSON.stringify({result:"something went wrong, contact admin"}));
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

//karyn's work
ra.post("/image", async (req, res) => {
  try {
    let {q} = req.body;
    //pre filter the user input
    question = user_input_filter(q);
    if(question === false || question.length < 4 || question.length > 1000) throw "invaild question";
    //call open ai api
    const ret = await get_an_image(q);
    //record api usage
    insert_to_api_usage({
      user_name: req.sessionID, 
      user_input: q, 
      caller: 'reading-assistance-text-to-image', 
      json: ret || {},
      ip_address: req.socket.remoteAddress
    });
    //respond
    console.log("in ra", ret);
    if(ret.error) throw new Error(ret.message);
    res.json({result: "success", image_url: ret.data[0].url, alt_image_url: ret.data[1].url});
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

// jeans' work
ra.post("/text", async (req, res) => {
  try {
    let {q} = req.body;
    console.log(req.body)

    //pre filter the user input
    question = user_input_filter(q);
    if(question === false || question.length < 4 || question.length > 1000) throw "question invaild";
    //call open ai api
    const ret = await explainText(q);
    
    console.log(ret);
    //record api usage
    insert_to_api_usage({
      user_name: req.sessionID, 
      user_input: q, 
      caller: 'reading-assistance-text-explaination', 
      json: ret, 
      req_usage: ret.usage.total_tokens,
      ip_address: req.socket.remoteAddress
    });
    const answer = ret?.choices?.[0]?.message?.content;
    res.json({result: "success", data: answer});
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

module.exports = ra;
