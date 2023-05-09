const express = require("express");
const ra = express.Router();
const { get_an_image, explainText } = require('./wrapped-api');
const {user_input_filter} = require('./str-filter');
const {insert_to_api_usage} = require('../queries/api-usage');
 
//karyn's work
ra.post("/image", async (req, res) => {
  try {
    let {q} = req.body;
    //pre filter the user input
    question = user_input_filter(q);
    if(question === false || question.length < 4 || question.length > 1000) throw "question invaild";
    //call open ai api
    const ret = await get_an_image(q);
    //record api usage
    insert_to_api_usage({user_name: req.sessionID, user_input: q, caller: 'reading-assistance-text-to-image', json: ret});
    //respond
    res.json({result: "success", image_url: ret.data?.[0]?.url});
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});

// jeans' work
ra.post("/text", async (req, res) => {
  try {
    let {q} = req.body;
    //pre filter the user input
    question = user_input_filter(q);
    if(question === false || question.length < 4 || question.length > 1000) throw "question invaild";
    //call open ai api
    const ret = await explainText(q);
    //record api usage
    insert_to_api_usage({user_name: req.sessionID, user_input: q, caller: 'reading-assistance-text-explaination', json: ret});
    const answer = ret?.choices?.[0]?.message?.content
     console.log(answer,ret.choices)
    res.json({result: "success", data: answer});
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
});
 
module.exports = ra;