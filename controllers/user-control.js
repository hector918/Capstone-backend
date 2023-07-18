const express = require("express");
const uc = express.Router();
const {check_userID_available, user_password_hash, create_an_user, login} = require('../queries/user-control');
const {userIdRegex, passwordRegex, user_input_filter} = require('./str-filter');
//////////////////////////////////////
uc.get("/available", async(req, res) => {
  console.log(req.session,req.sessionID,"a")
  console.log(req.socket.remoteAddress);
  try {
    res.json({userIdRegex, passwordRegex});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
});

uc.post('/register', async(req, res) => {
  try {
    let {userId, password} = req.body;
    //define new user json
    let newUserJson = { 
      userid: userId, 
      password: user_password_hash(password), 
      availability: true, 
      current_session: req.sessionID,
      username: generateUsername(),
      last_seen: new Date().toUTCString(),
      ip_address: req.socket.remoteAddress,
    }
    console.log(newUserJson);
    //insert in to db
    const ret = await create_an_user(newUserJson);
    if(ret !== false){
      res.json({userId: ret.userid});
    } else throw req.trans("Add user failed.");
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
});

uc.get('/logout', async (req,res) => {
  try {
    req.session.userInfo = {};
    req.session.save();
    res.json({data: req.trans("Successed logout.")})
  } catch (error) {
    console.error(error);
    res.status(500).json({"error": "error"});
  }
});

uc.post("/login", async(req, res) => {
  try {
    let {userId, password} = req.body;
    const ret = await login({
      userid: user_input_filter(userId), password: user_input_filter(password)
    })
    if(ret === false){
      //if login failed
      res.json({error: req.trans("User ID or password not matched.")})
    }else{
      //if login successed
      const templete = {"username":"text",  "last_seen":"text", "credit": "text", "profile_setting": "json"};
      for(let x in templete) if(ret[x]) templete[x] = ret[x];
      res.json({data: templete});
      req.session.userInfo = templete;
      req.session.save();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: req.trans("Ooops..., contact Admin please.")});
  }
});

uc.get('/check_login_status', async(req, res) => {
  try {
    const ret = req.session.userInfo || {};
    res.json({data: ret});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
});

uc.post('/check_userID', async(req, res) => {
  try {
    let {userId} = req.body;
    let result = await check_userID_available(userId);
    // result = false;
    res.json({result});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
});
//////////////////////////////////////
function VerifyUserLogin(req, res, next){
  console.log("in verify user login",req.session.userInfo);
  if(req.session.userInfo === undefined){
    //new session, no login also
  }else if(req.session.userInfo.userId === undefined){
    //was login, but logout already
  }else if(req.session.userInfo.userId){
    //login user
  }
  //if success
  next();
}
function generateUsername() {
  var adjectives = ['happy', 'sad', 'funny', 'serious', 'clever', 'smart', 'kind', 'brave', 'shiny', 'silly', 'energetic', 'graceful', 'playful', 'witty', 'gentle', 'curious', 'charming', 'vibrant', 'daring', 'fantastic'];
  var nouns = ['penguin', 'elephant', 'tiger', 'koala', 'dolphin', 'lion', 'monkey', 'giraffe', 'unicorn', 'octopus', 'kangaroo', 'panda', 'zebra', 'parrot', 'dinosaur', 'jaguar', 'butterfly', 'peacock', 'otter', 'hedgehog'];
  
  var adjectiveIndex = Math.floor(Math.random() * adjectives.length);
  var nounIndex = Math.floor(Math.random() * nouns.length);
  
  var username = adjectives[adjectiveIndex] + ' ' + nouns[nounIndex];
  
  return username;
}
//////////////////////////////////////
module.exports = {uc , VerifyUserLogin};