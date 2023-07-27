const express = require("express");
const luda = express.Router();
const fs = require('fs');
const path = require('path')

const {user_input_letter_and_numbers_only} = require('./str-filter');
const {verifyUserLogin} = require('./user-control');
const {getDocumentsByUser, InsertDocumentLinkToUser} = require('../queries/documents');
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

luda.post('/addDocumentToUser', verifyUserLogin, async(req, res) => {
  try {
    const {userId} = req.session.userInfo;
    const {filehash} = req.body;
    //insert to db
    const ret = await InsertDocumentLinkToUser(userId, filehash);
    if(ret === false) throw new Error(req.trans("add document to user failed."));
    ret.filehash = filehash;
    res.json({data: ret});
    log_user_action(userId, 'user linked a document', JSON.stringify(ret));
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
})
//////////////////////////////////////////////////
module.exports = luda;