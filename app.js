const express = require("express");
const cors = require("cors");
const sessions = require("express-session");
var FileStore = require('session-file-store')(sessions);
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

app.use(sessions({
  secret: 'sessionsecret123593405843059',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 },//oneday
  store: new FileStore({}),
  sameSite : "lax"
}));
// app.use(express.static("./frontend/starter-pern-crud/build"));

// function auth(req, res, next) {
//   // Checking for the session
//   console.log(req.sessionID,req.session.username,req.originalUrl);
//   if(!req.session.username)
//   {
//     res.status(401).redirect('/');
//   }
//   else
//   {
//     next();
//   }
  
// }


// /////////////////////////////////////////////
// app.post('/songs/login/',(req,res) => {
//   let {name} = req.body;
//   name = name?.replace(/[^a-zA-Z\d\s]+/gm,"");

//   if(req.session.username){//如果 已经有名
//     res.json({success:"true",name:req.session.username});
//   }else if (name){//如果 是入来认证的
//     req.session.username = name?name:undefined;
//     res.json({success:"true",name});
//   }else{//如果是混吉的

//     res.status(401).send("You are not authenticated");
//   }
// });
// app.use(auth);
// app.get('/songs/logout',(req,res) => {
//   req.session.destroy();
//   res.redirect('/');
// });
// /////////////////////////////////////////////
// app.get("/", (req, res) => {
//   res.send("Hello song world!");
// });
// /////////////////////////////////////////////
// app.use("/songs/playlists", require("./controllers/playlistController"));
// app.use("/songs", require("./controllers/songController"));

/////////////////////////////////////////////
app.get("*", (req, res) => {
  console.log(req.session,req.sessionID,"a")
  res.status(404).send("no page found!");
});

////////////////////////////////////////////////
module.exports = app;