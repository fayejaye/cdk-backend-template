const moment = require('moment')
module.exports.handler = function(event, context, callback) {
const a = moment().toDate();
const response = {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
  },
  body: JSON.stringify({ "message": `${a}- Faye` })
};

callback(null, response);
};