const express = require("express");
const testing = express.Router();
const {insertDocument, removeDocumentFromUser} = require('../queries/documents');
const {verifyUserLogin} = require('./user-control');

testing.get('/1', (req, res) => {
  try {
    insertDocument('bbbb', '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef');
    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
});

testing.get('/2', (req, res) => {
  try {
    removeDocumentFromUser('bbbb', '1');
    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
});

module.exports = testing;