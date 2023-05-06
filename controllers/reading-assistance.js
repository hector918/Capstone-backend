const express = require("express");
const ra = express.Router();

const { askAquestion } = require("../queries/api-usage.js");

ra.post("/", async (req, res) => {
  const {question} = req.body;
  console.log("testing in ra");
  try {
    const recieveQuestion = await askAquestion(req.body);
    res.json(recieveQuestion);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

module.exports = ra;
