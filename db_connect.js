var mongoose = require('mongoose');
var single_connection;

module.exports = function() {  
  var url = process.env.MONGODB_URI || "mongodb://localhost/brlet";
  
  if(!single_connection) {
    single_connection = mongoose.connect(url);
  }
  
  return single_connection;
};