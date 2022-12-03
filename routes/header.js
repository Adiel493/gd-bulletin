var express = require('express');
var router = express.Router();
var database = require('../database')

router.get('/', function(req, res, next) {
  res.render('header');
});

router.post("/userInfo", function (request, response, next) {


  var query = "SELECT * FROM USERS WHERE IS_LOGIN = 1";

  database.query(query, function (error, data) {

    response.json(data[0]);

  });

});


router.post("/signOut", function (request, response, next) {

  var query = "UPDATE USERS SET IS_LOGIN = 0 WHERE IS_LOGIN = 1";

  database.query(query, function (error, data) {
    response.json({
      message: data
    });
  });

});

module.exports = router;