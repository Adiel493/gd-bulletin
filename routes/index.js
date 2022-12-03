var express = require('express');
var router = express.Router();
var database = require('../database')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/login", function (request, response, next) {
  var user = request.body.user;
	var password = request.body.password;

  var query = `SELECT * FROM USERS WHERE EMAIL = "${user}" AND PASS = "${password}"`;

  database.query(query, function (error, data) {
    response.json({
      message: data,
    });
  });

});

router.post("/update", function (request, response, next) {
  var user = request.body.user;
	var password = request.body.password;

  var query = `UPDATE USERS SET IS_LOGIN = 1 WHERE EMAIL = "${user}" AND PASS = "${password}"`;

  database.query(query, function (error, data) {
    response.json({
      message: 'YES',
    });
  });

});


module.exports = router;
