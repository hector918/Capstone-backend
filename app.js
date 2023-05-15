const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
require('./session-config')(app);// init session

app.use(express.static("./public"));

app.use("/rc", require("./controllers/reading-comprehension"));
app.use("/ra", require("./controllers/reading-assistance"));
app.use("/upload_files", require("./controllers/upload-file"));
app.use("/download_file", require("./controllers/download-file"));
app.use("/rau", require("./controllers/read-api-usage"));

/////////////////////////////////////////////
app.get("*", (req, res) => {
  // console.log(req.session,req.sessionID,"a")
  res.status(404).send("<h3>page not found.</h3><p> by Binary mind. 2023 </p>");
});

////////////////////////////////////////////////
module.exports = app;