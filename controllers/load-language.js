const express = require("express");
const ll = express.Router();
const {accept_file_only, user_input_letter_and_numbers_only}  = require('./str-filter');
const fs = require("fs");
const path = require('path');
///express route//////////////////////
ll.get('/json_file/:language', async(req, res) => {
  console.log(req.session,req.session.language)
  try {
    //filter user input
    const languageFile = accept_file_only(req.params.language);
    //combine path
    const filePath = path.join(__dirname, `../languages/${languageFile}`);
    if(fs.existsSync(filePath)) {
      res.sendFile(filePath);
    }else throw "file not found";
  } catch (error) {
    console.error(error);
    res.status(404).json(error);
  }
})
ll.get('/change_language/:language', async (req, res) => {
  console.log(req.session.language);
  const userInputLanguage = user_input_letter_and_numbers_only(req.params.language);
  req.session.language = userInputLanguage;
  res.send(req.session.language);
});
//get local translate////////////////////////
//////////////////////////////////////
module.exports = {
  ll,

};