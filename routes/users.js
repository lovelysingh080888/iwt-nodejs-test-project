
var express = require('express');
var UserController = require("../controllers/UserController");
var router = express.Router();

router.post('/api/register',[UserController.register]);

module.exports = router;
