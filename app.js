const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({ credentials: true, origin: true }));
// app.use(express.json());
require('./session-config')(app);// init session

// app.use(express.static("./frontend/starter-pern-crud/build"));

app.use("/rc", require("./controllers/reading-comprehension"));
// app.use("/ra", require("./controllers/reading-comprehension"));

/////////////////////////////////////////////
app.get("*", (req, res) => {
  // console.log(req.session,req.sessionID,"a")
  res.status(404).send("no page found!");
});

////////////////////////////////////////////////
module.exports = app;