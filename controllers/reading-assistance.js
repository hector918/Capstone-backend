const express = require("express");
const ra = express.Router();

const { askAquestion } = require("../queries/api-usage.js");
const { get_an_image } = require("./text-to-image-prompt.js");
ra.post("/image", async (req, res) => {
  const { question } = req.body;

  const result = await get_an_image("cute bunny");
  console.log(result)
  console.log(Object.keys(result), result.response.data.error);
  res.send(JSON.stringify(result));
  // console.log("testing in ra");
  // try {
  //   const recieveQuestion = await askAquestion(req.body);
  //   res.json(recieveQuestion);
  // } catch (error) {
  //   res.status(400).json({ error: error });
  // }
});

module.exports = ra;
