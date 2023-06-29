const express = require("express");
const ll = express.Router();

//////////////////////////////////////
ll.get("/available", async(req, res) => {
  console.log("login checking")
  try {
    res.json({});
  } catch (error) {
    res.status(500).json({});
  }
});


module.exports = ll;