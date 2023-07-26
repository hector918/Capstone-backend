const express = require("express");
const luda = express.Router();
const fs = require('fs');
const path = require('path')

const {user_input_letter_and_numbers_only} = require('./str-filter');
const {verifyUserLogin} = require('./user-control');
const {getDocumentsByUser} = require('../queries/documents');
const {log_user_action} = require('../queries/user-control');
const {getMetaDataByHash} = require('./public-document-access');
//////////////////////////////////////////////////
luda.get('/library', verifyUserLogin, async(req, res) => {
  try {
    const {userId} = req.session.userInfo;
    //read it from db
    const ret = await getDocumentsByUser(userId);
    for(let idx in ret){
      //read detail from hard drive
      const {meta} = getMetaDataByHash(ret[idx]['filehash']);
      ret[idx] = {...ret[idx], ...meta};
    }
    //return
    res.json({data: ret});
    //record user Activity
    log_user_action(userId, 'user asking for library data', JSON.stringify(ret));
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});
//////////////////////////////////////////////////
module.exports = luda;