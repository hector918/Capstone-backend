const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const fs = require('fs');

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// init session
require('./session-config')(app);
//init language module
require('./controllers/load-language').getTranslation(app);

///////
app.use(express.static("./public"));

app.use("/rc", require("./controllers/reading-comprehension"));
app.use("/ra", require("./controllers/reading-assistance"));
app.use("/upload_files", require("./controllers/upload-file"));
app.use("/download_file", require("./controllers/download-file"));
app.use("/rau", require("./controllers/read-api-usage"));


///07-01-2023////////////////////////////
app.use("/pda", require("./controllers/public-document-access"));
app.use("/login", require("./controllers/user-control").uc);
app.use("/languages", require("./controllers/load-language").ll);

/////////////////////////////////////////////

app.get("*", (req, res) => {
  // console.log(req.session,req.sessionID,"a")
  // console.log(req.socket.remoteAddress);
  const file_path = `${__dirname}/public/index.html`;
  if(fs.existsSync(file_path)){
    res.sendFile(file_path);
  }else res.status(404).send(`<h3>${req.trans('file not found.')}</h3><p style='position: absolute;bottom: 0;right: 0;margin-right: 3%'> by [Binary mind]. 2023 </p>`);
});

////////////////////////////////////////////////
module.exports = app;