const express = require("express");
const rau = express.Router();

rau.get('/',async (req, res)=>{
  const {read_api_usage} = require('../queries/api-usage');
  const ret = await read_api_usage();
  res.send(JSON.stringify(ret))
})

module.exports = rau;