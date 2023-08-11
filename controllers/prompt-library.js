const express = require("express");
const prompt = express.Router();
const {readAllPromptByUser, insertNewPrompt} = require("../queries/prompt-library");
const {verifyUserLogin} = require('./user-control');
///////////////////////////////////
prompt.post('/new', verifyUserLogin, async(req, res) => {
  try {
    const {type, prompt, title} = req.body;
    const {userId} = req.session.userInfo;
    const ret = await insertNewPrompt(userId, type, title, prompt);
    console.log(ret);
    if(ret){
      res.json({data: ret});
    }else{
      throw new Error("error in inserting new prompt");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
})

prompt.get("/", verifyUserLogin, async(req, res) => {
  try {
    const {userId} = req.session.userInfo;
    const ret = await readAllPromptByUser(userId);
    res.json({data: ret});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
})
///////////////////////////////////
module.exports = prompt;
