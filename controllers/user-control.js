const express = require("express");
const uc = express.Router();
const {check_userID_available, user_password_hash, create_an_user} = require('../queries/user-control');
const {userIdRegex, passwordRegex} = require('./str-filter');
//////////////////////////////////////
uc.get("/available", async(req, res) => {
  console.log(req.session,req.sessionID,"a")
  console.log(req.socket.remoteAddress);
  try {
    res.json({userIdRegex, passwordRegex});
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
});

uc.post('/register', async(req, res) => {
  try {
    let {userId, password} = req.body;
    //define new user json
    let newUserJson = { 
      userId, 
      password: user_password_hash(password), 
      availability: true, 
      current_session: req.sessionID,
      userName: generateUsername(),
      last_seen: new Date(),
      ip_address: req.socket.remoteAddress,
    }
    console.log(newUserJson);
    //insert in to db
    const ret = await create_an_user(newUserJson);
    if(ret !== false){
      res.json({userId: ret.userId});
    } else throw req.trans("Add user failed.");
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
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
    res.status(500).json({error});
  }
});
//////////////////////////////////////
function generateUsername() {
  var adjectives = ['happy', 'sad', 'funny', 'serious', 'clever', 'smart', 'kind', 'brave', 'shiny', 'silly', 'energetic', 'graceful', 'playful', 'witty', 'gentle', 'curious', 'charming', 'vibrant', 'daring', 'fantastic'];
  var nouns = ['penguin', 'elephant', 'tiger', 'koala', 'dolphin', 'lion', 'monkey', 'giraffe', 'unicorn', 'octopus', 'kangaroo', 'panda', 'zebra', 'parrot', 'dinosaur', 'jaguar', 'butterfly', 'peacock', 'otter', 'hedgehog'];
  
  var adjectiveIndex = Math.floor(Math.random() * adjectives.length);
  var nounIndex = Math.floor(Math.random() * nouns.length);
  
  var username = adjectives[adjectiveIndex] + ' ' + nouns[nounIndex];
  
  return username;
}
//////////////////////////////////////
module.exports = uc;