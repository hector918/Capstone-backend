// DEPENDENCIES
const app = require("./app.js");
const http = require("http");
const https = require("https");
var fs = require('fs');

// CONFIGURATION
require("dotenv").config();
const PORT = process.env.PORT;
const options = {
  key: fs.readFileSync('./sslcert/localhost-key.pem', 'utf8'),
  cert: fs.readFileSync('./sslcert/localhost.pem', 'utf8')
}

// LISTEN
try {
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Https Listening on port ${PORT}`);
  });
  http.createServer(app).listen(PORT -1, () => {
    console.log(`Http Listening on port ${PORT -1}`);
  });
} catch (error) {
  console.log(error);
}


// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });