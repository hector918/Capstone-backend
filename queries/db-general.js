const timestamp = ()=> ({timestamp: new Date().toUTCString()});
const error_handle = (err) => {console.error(err)};

module.exports = {
  timestamp,
  error_handle
}