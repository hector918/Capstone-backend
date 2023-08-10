const express = require("express");
const cwo = express.Router();
const {chatCompletion} = require('./wrapped-api');
const { listen_to_sse, hosting_sse } = require('./server-sent-event');
const {verifyUserLogin} = require('./user-control');
//////////////////////////////////////////
cwo.post('/openai/SSE', verifyUserLogin, (req, res) => {
  try {
    const {messages} = req.body;
    const response = chatCompletion('gpt-3.5-turbo-16k', messages, 1);
    //handle openai sse 
    if(response){
      const stream_handler = hosting_sse(req, res);
      listen_to_sse(response, stream_handler);
      //it end's here, the res will be handle by hosting_sse
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
  //openai response handling
})

module.exports = cwo;
