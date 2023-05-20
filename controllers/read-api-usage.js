const express = require("express");
const rau = express.Router();

rau.get('/',async (req, res) => {
  const {read_api_usage} = require('../queries/api-usage');
  let {start, limit} = req.query;
  start = isNaN(Number(start)) ? 0 : Number(start);
  limit = Math.min(limit, 2000);
  
  const ret = await read_api_usage(start, limit);
  res.send(JSON.stringify(ret));
})

module.exports = rau;