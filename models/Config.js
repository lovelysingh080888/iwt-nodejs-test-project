
var mongoose = require ("mongoose");


var DB = mongoose.createConnection(process.env.MONGO_DB);

module.exports = DB;