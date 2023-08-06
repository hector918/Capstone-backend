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
  const https_server = https.createServer(options, app).listen(PORT, () => {
    console.log(`Https Listening on port ${PORT}`);
  });
  const http_server = http.createServer(app).listen(PORT -1, () => {
    console.log(`Http Listening on port ${PORT -1}`);
  });

  https_server.on('clientError', handle_client_error);
  http_server.on('clientError', handle_client_error);
} catch (error) {
  console.log(error);
}

function handle_client_error(error, socket) {
  console.error('clientError:', error);
  socket.destroy();  // This will destroy the socket
}
// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });