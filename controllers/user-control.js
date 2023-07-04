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
    console.log(userId, password);
    let newUserJson = { 
      userId, 
      password: user_password_hash(password), 
      availability: true, 
      current_session: req.sessionID,
      last_seen: new Date(),
      ip_address: req.socket.remoteAddress,
    }
    console.log(newUserJson);
    const ret = await create_an_user(newUserJson);
    console.log(ret);
    res.json({});
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

module.exports = uc;