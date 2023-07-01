const express = require("express");
const uc = express.Router();

//////////////////////////////////////
uc.get("/available", async(req, res) => {
  console.log(req.session,req.sessionID,"a")
  console.log(req.socket.remoteAddress);
  try {
    res.json({});
  } catch (error) {
    res.status(500).json({});
  }
});

uc.post('/register', async(req, res) => {
  
});

module.exports = uc;