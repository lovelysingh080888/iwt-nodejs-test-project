var express = require('express');
var path = require('path');
var cors = require('cors');
require("dotenv").config();

var app = express(); 
 var corsOption = {
   origin: "http://localhost:3000"
 }
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public",express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(cors(corsOption));

var user = require("./routes/users");
app.post('/api/register',user);

app.use((req, res, next) => {
  const error = new Error('Request not found');
  return res.status(404).json({
      message: error.message
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server Running on port "+process.env.PORT);
})
module.exports = app;
