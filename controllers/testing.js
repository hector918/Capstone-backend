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
        type: "Preset - Software development",
        title: "code interpreter in any language",
        json: {}, timestamp: "",
        content: 'I want you to act like a interpreter/compiler. I will give you code, and you will execute it. Do not provide any explanations. Do not respond with anything except [output: the output of the code]  and [console: console messages]. and you needs to detect the language I send you, The first code is: '
      },
      {
        type: "Preset - Software development",
        title: "Explain and debug",
        json: {}, timestamp: "",
        content: 'A little bit of arithmetic and a logical approach will help us quickly arrive at the solution to this problem, you are an senior software engineer. I will give you code, and you will explain and debug it for me, here is the code: '
      },
      {
        type: "Preset - Cover letter template from Tim on resume",
        title: "Resume Review",
        content: `read my resume and use this template to build my cover letter, here is the template:
        To whom it may concern,
        My name is XNAMEX and I am submitting an application to fill the "XPOSITIONX" position. My current work and past experience within the Xpast experiences i.e. business, edu, adminX sectors allowed me to develop a diversified skill-set perfectly suited for this opportunity. I absolutely love the... BE SPECIFIC to Job description / company values HEREX. As a leader, I embody a sense of optimism as a self-starter within any junior engineering position. note why you are passionate about technologyX.
        I bring a unique background tying together note your subject matter expert skills. My track for technology coupled with my work ethic embodies the following core values and characteristics that would be necessary for the role below:
        Tim's Note: LOOK AT THE JOB DESCRIPTION AND IDENTIFY WHICH BULLETS YOU WANT TO NOTE! You will want to have 5 to 7 bullets already created and given the job description, pick 3 or 4.
        *   Proficient Experience with XTECH STACKX:
        *   Achieve Impact as a Continuous Learner:
        *   Strategic Thinking and Data Driven:
        *   Strategic Thinking and Data Driven:
        *   Strategic Thinking and Data Driven:
        Highlightable strengths I bring into the role include project management workflows, training capacity, and communication skills. Prior employment experiences have allowed me to Xlook at the responsibilities of the job description and note this section. Furthermore, my capstone experience allowed me to Xprovide context on your capstone and what you had done. Leverage your resume!.
        In all my roles and my software engineering training, this has allowed me to learn quickly, adapt, and rise to the occasion of any task put in front of me. It is because of these characteristics and my deep passion within SECTOR TOPIC sector that I am looking for the position for the XPOSITIONX.
        Thank you for your time and careful consideration of my application. I am excited by this opportunity. If you have any questions, please feel free to reach out at your convenience.
        Sincerely,`,
        json: {}, timestamp: ""
      },
      {
        type: "Preset - Working on resume",
        title: "Resume Review",
        content: "Take a deep breath, I want you to act as a skilled resume reviewer and evaluate my resume to help me achieve my career goals. Provide comprehensive feedback on the overall format, layout, and design of my resume to ensure it is visually appealing and professional. Analyze the content of each section, including the summary, work experience, education, and skills, and offer valuable suggestions to highlight my key achievements and contributions effectively. Additionally, assess the use of keywords and industry-specific terminology to tailor my resume for specific job opportunities.",
        json: {}, timestamp: ""
      },
      {
        type: "Preset - Working on resume",
        title: "Resume Summary",
        content: "read my resume and i want to create four to five bullets to describe my strength, next message is my resume.",
        json: {}, timestamp: ""
      },
      {
        type: "Preset - Job searching",
        title:"Generate cover letter in short",
        content: "Let’s combine our numerical command and clear thinking to quickly and accurately decipher the answer, draft a persuasive cover letter in 150 words or less highlighting my qualifications and enthusiasm for the [position] at [company] using my resume below.",
        json:{}, timestamp:""
      },
      {
        type: "Preset - General writing",
        title: "rephrase writing",
        content: "Take a deep breath and, proofread my writing below. Fix grammar and spelling mistakes. And rephrase that improve the clarity of my writing",
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