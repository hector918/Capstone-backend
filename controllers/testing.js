const express = require("express");
const testing = express.Router();
const {insertDocument, removeDocumentFromUser} = require('../queries/documents');
const {verifyUserLogin} = require('./user-control');
const preset_content = require('../queries/preset-content');
require("dotenv").config();
const passcode = process.env.TESTING_PW;
testing.get('/1/'+passcode, (req, res) => {
  try {
    // insertDocument('bbbb', '0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef');
    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
});

testing.get('/2/'+passcode, (req, res) => {
  try {
    // removeDocumentFromUser('bbbb', '1');
    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
});

testing.get('/3/'+passcode, async(req, res) => {
  try {
    const json = [
      {
        type: "preset-working on resume",
        content: "I want you to act as a skilled resume reviewer and evaluate my resume to help me achieve my career goals. Provide comprehensive feedback on the overall format, layout, and design of my resume to ensure it is visually appealing and professional. Analyze the content of each section, including the summary, work experience, education, and skills, and offer valuable suggestions to highlight my key achievements and contributions effectively. Additionally, assess the use of keywords and industry-specific terminology to tailor my resume for specific job opportunities.",
        title: "Resume Review",
        json: {}, timestamp: ""
      },
      {
        type: "preset-working on resume",
        content: "read my resume and i want to create four to five bullets to describe my strength, next message is my resume.",
        title: "Resume Summary",
        json: {}, timestamp: ""
      },
      {
        type: "preset-career",
        content: `Act as a salary negotiation mentor and guide me through the process of negotiating my compensation for a job offer. Begin by assessing my skills, qualifications, and experience to determine a competitive salary range for the position I am pursuing.
        Help me craft a compelling case to showcase my value to the employer, highlighting my unique contributions and achievements. Provide tips on how to gather salary data and market research to support my negotiation arguments. next message is my info.`,
        title: "Salary Negotiation",
        json: {}, timestamp: ""
      },
      {
        type: "preset-job searching",
        content: "Read my resume, compose a professional cover letter demonstrating how my abilities align with the requirements for the [position] at [company]. Use the information below as a guide.",
        title: "write cover letter-long",
        json: {}, timestamp: ""
      },
      {
        type: "preset-job searching",
        content: "Draft a persuasive cover letter in 150 words or less highlighting my qualifications and enthusiasm for the [position] at [company] using my resume below.",
        title:"write cover letter-short",
        json:{}, timestamp:""
      },
      {
        type: "preset-general writing",
        content: "Proofread my writing below. Fix grammar and spelling mistakes. And rephrase that improve the clarity of my writing",
        title: "rephrase writing",
        json: {}, timestamp: ""
      },

    ];
    const ret = await preset_content.InsertPresetContent("preset-prompt", {"preset-prompt": json});
    res.json({ret});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
});

testing.get("/4/"+passcode, async(req, res) => {
  try {
    preset_content.removePresetContentByName('preset-prompt');
    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
})

testing.get('/5/'+passcode, async(req, res) => {
  try {
    const json = {
      "Random":[
        {
          fileHash: "f9c5fe26cc9e902ea8dea27e7603678a4df8986c8d8a7c88b900eeef07db0390",
          history: {},
          meta:{
            name: "What are embeddings",
            size: 0,
            type: "application/pdf"
          }
        },
        
        {
          fileHash: "40c26000f421170f9d739edb6886d666fc137be591c10c2064a5d9fab2e2b54b",
          history: {},
          meta:{
            name: "The Road To Serfdom",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "c2c8366d969692864a7950c617898aa50ddb994e342675dfa6cb5ee5790eca5e",
          history: {},
          meta:{
            name: "The Moon And Sixpence",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "5a44e6548cceec5cb5df52f8cda6823d793998d2d7c26e84e55c6f87910d4757",
          history: {},
          meta:{
            name: "Immunology and Evolution of Infectious Disease",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "1bf72b69b4dbfce32cf0868aeaf916ce4dcf160d4eeffef634ff4cf43614d8b8",
          history: {},
          meta:{
            name: "The Sayings of Confucius",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "29bfad5c78e8e134c98d2deb4cd8a66e1d60c56722bd8821a8504ce4df609ae5",
          history: {},
          meta:{
            name: "Smart TV Manual",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "fe0c59778fad892708f17c9eebe90dc03ae31dbfd420deb1c0de183bd8c165d1",
          history: {},
          meta:{
            name: "The Three-Body Problem",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          
          fileHash: "3d289e286cbb46848d5e7ee8315108d94e35805c80805a53792ab9f34b5535a0",
          meta:{
            name: "金瓶梅词话.pdf",
            size: 0,
            type: "application/pdf"
          }
        },
      ],
      "Classic": [
        {
          fileHash: "c2c8366d969692864a7950c617898aa50ddb994e342675dfa6cb5ee5790eca5e",
          history: {},
          meta:{
            name: "The Moon And Sixpence",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "88015c70f43475c09fb87aa99ddc807245d83cfa4b5cb7e370576517600fb517",
          history: {},
          meta:{
            name: "A Tale of Two Cities",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "0ad1d820761a5aca9df52c22ea1cfc4ca5dad64923f51270dbe8f106f3817eef",
          history: {},
          meta:{
            name: "Old Man And The Sea",
            size: 0,
            type: "application/pdf"
          }
        },
        
        {
          fileHash: "fd157773a5d74fae7af804e890c3fbc71b76066ca87c39850ccf903c22874e00",
          history: {},
          meta:{
            name: "THE CROWD: A STUDY OF THE POPULAR MIND",
            size: 0,
            type: "application/pdf"
          }
        },
        
        {
          fileHash: "ca6bd2dbb4550f7d14edd155390568dde9f6d00d394fc2ae46a487d483e66160",
          history: {},
          meta:{
            name: "The Unbearable Lightness Of Being",
            size: 0,
            type: "application/pdf"
          }
        },

        {
          fileHash: "ca0fb10ada5af2f34aa8809e2c5be43b45ff2a04561a8aa388ddd514c7cc5c53",
          history: {},
          meta:{
            name: "1984",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "e0c478edf6ee6104be2188a55ca4603e0e224e8eac0111498e7146b5b08ab933",
          history: {},
          meta:{
            name: "Hamlet & Macbeth",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "88015c70f43475c09fb87aa99ddc807245d83cfa4b5cb7e370576517600fb517",
          meta:{
            name: "三国演义.pdf",
            size: 0,
            type: "application/pdf"
          }
        },
      ],
      "History and Romance": [
        {
          fileHash: "1bf72b69b4dbfce32cf0868aeaf916ce4dcf160d4eeffef634ff4cf43614d8b8",
          history: {},
          meta:{
            name: "The Sayings of Confucius",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "88015c70f43475c09fb87aa99ddc807245d83cfa4b5cb7e370576517600fb517",
          history: {},
          meta:{
            name: "A Tale of Two Cities",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "88015c70f43475c09fb87aa99ddc807245d83cfa4b5cb7e370576517600fb517",
          meta:{
            name: "三国演义.pdf",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "8d36c5cbf9b80e152d6913a153d97fd96f493efbda11a5ed489f0a5c432c0164",
          meta:{
            name: "国史大纲-上册.pdf",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "1868e418d4b8d2c4134815929da4df7e18da463e4fcf852f6523d9f1b3117183",
          meta:{
            name: "两晋演义.pdf",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "3d289e286cbb46848d5e7ee8315108d94e35805c80805a53792ab9f34b5535a0",
          meta:{
            name: "金瓶梅词话.pdf",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "f068c5eda39cde86eac708ec6c2bc5aa4fe8da5b1c9940b0f7599e5847fcbbfd",
          meta:{
            name: "八千湘女上天山.pdf",
            size: 0,
            type: "application/pdf"
          }
        },
        {
          fileHash: "b69b25eda2eb6647966094e52e89462186b7cd544f640dbd52ca9ba513038f8c",
          meta:{
            name: "水浒传.pdf",
            size: 0,
            type: "application/pdf"
          }
        }
      ],
    }
    const ret = await preset_content.InsertPresetContent("preset-moving-gallery", {"preset-moving-gallery": json});
    res.json({ret});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
})

testing.get('/6/'+passcode, async(req, res) => {
  try {
    const json = {
      History: [],
      Classic: [],
      Random: []
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message});
  }
})

module.exports = testing;