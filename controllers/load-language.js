const express = require("express");
const ll = express.Router();
const {accept_file_only, user_input_letter_and_numbers_only}  = require('./str-filter');
const fs = require("fs");
const path = require('path');
/////////////////////////////////
const languageFilesPath = path.join(__dirname, `../languages`);
///express route//////////////////////
ll.get('/all_languages', async(req, res) => {
  const ret = {
    availableList:[
      ["Chinese", "chinese.json"],
      ["English", "english.json"],
    ],
    currentLanguage: req.session.language,
    translation: getLanguageFile(req.session.language)
  };
  res.json(ret);
})

ll.get('/change_language/:languageFile', async (req, res) => {
  try {
    const userInputLanguage = accept_file_only(req.params.languageFile);
    //if language json exists change language
    if(fs.existsSync(`${languageFilesPath}/${userInputLanguage}`)){
      req.session.language = userInputLanguage;
      res.sendFile(`${languageFilesPath}/${userInputLanguage}`);
    }else{
      res.json({result: false});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
  
});
//get local translate//////////////////////
function getTranslation(app){
  app.use(function (req, res, next){
    
    try {
      //attach translate function to req
      req.trans = defaultOutput;
      //attach language file to req
      if(req.session.language)
      {
        req.language = getLanguageFile(req.session.language);
      }else{
        req.language = getLanguageFile("english");
      }
      next();
    } catch (error) {
      console.error(error);
      next();
    }
  })
}
//////////////////////////////
function defaultOutput(str){
  if(this.language[str]) return this.language[str];
  return str;
}
function getLanguageFile(language){
  const filePath = `${languageFilesPath}/${language}`;
  try {
    if(fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath));
    }throw `language ${language} file not found.`;
  } catch (error) {
    console.error(error);
    return JSON.parse(fs.readFileSync(`${languageFilesPath}/english.json`));
  }
}
//////////////////////////////////////
module.exports = {
  ll,
  getTranslation,
};