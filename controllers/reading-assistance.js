const express = require("express");
const ra = express.Router();

ra.post("/", async (req, res)=>{
  console.log("testing in ra")
})

module.exports = ra;