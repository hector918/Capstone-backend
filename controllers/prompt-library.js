const express = require("express");
const prompt = express.Router();
const {readAllPromptByUser, insertNewPrompt, deletePrompt} = require("../queries/prompt-library");
const {getPresetContetntByName} = require('../queries/preset-content');
const {verifyUserLogin} = require('./user-control');
///////////////////////////////////
prompt.post('/new', verifyUserLogin, async(req, res) => {
  try {
    const {type, prompt, title, linkslist} = req.body;
    if(type.length > 100) new Error("type value too long");
    if(title.length > 100) new Error("title value too long");
    if(prompt.length > 2000) new Error("prompt value too long");
    if(JSON.stringify(linkslist).length > 2000) new Error("linkslist value too long");
    const {userId} = req.session.userInfo;
    const ret = await insertNewPrompt(userId, type, title, prompt, {links: linkslist});
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
    const preset_prompt = (await getPresetContetntByName("preset-prompt")).content['preset-prompt'];
    res.json({data: [...ret, ...preset_prompt]});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
})

prompt.delete('/:prompt_id', verifyUserLogin, async(req, res) => {
  try {
    const {userId} = req.session.userInfo;
    const {prompt_id} = req.params;
    const ret = await deletePrompt(userId, prompt_id);
    console.log(ret);
    if(ret === null) throw new Error("nothing is deleted");
    res.json({data: "success"});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
})
///////////////////////////////////
module.exports = prompt;
