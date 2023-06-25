const express = require("express");
const {list_models} = require('./wrapped-api');
const rau = express.Router();

rau.get('/',async (req, res) => {
  const {read_api_usage} = require('../queries/api-usage');
  let {start, limit} = req.query;
  start = isNaN(Number(start)) ? 0 : Number(start);
  limit = Math.min(limit, 2000);
  try {
    const ret = await read_api_usage(start, limit);
    res.json(ret);
  } catch (error) {
    res.status(500).json(error);
  }
  
})

rau.get("/list_model", async (req, res) => {
  console.log("asking list model")
  res.send(JSON.stringify(await list_models()));
})

module.exports = rau;