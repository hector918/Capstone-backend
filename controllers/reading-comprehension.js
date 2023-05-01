const express = require("express");
const rc = express.Router();

rc.get("/", async (req, res)=>{

  console.log("testing in rc",req.session);
  res.send("Dsads")
})

rc.post("/", async (req, res)=>{

  console.log("testing in rc",req.session);
  res.send("1231312")
})


module.exports = rc;