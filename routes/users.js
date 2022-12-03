var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users');
});

router.post("/action", function (request, response, next) {

	var action = request.body.action;

	if (action == 'fetch') {
		var query = "SELECT * FROM USERS ORDER BY ROLE, NAME";

		database.query(query, function (error, data) {

			response.json({
				data: data
			});

		});
	}

	if (action == 'Add') {
		var name = request.body.name;
		var role = request.body.role;
		var level = request.body.level;
		var email = request.body.email;
		var phone = request.body.phone;
		var pass = request.body.password;

		var query = `
		INSERT INTO USERS 
		(NAME, ROLE, LEVEL, EMAIL, PHONE, PASS, CREATE_DATE, UPDATE_DATE) 
		VALUES ("${name}", "${role}", "${level}", "${email}", "${phone}", "${pass}", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		`;

		database.query(query, function (error, data) {

			response.json({
				message: `Usuario ${name} agregado exitosamente `
			});

		});
	}

	if (action == 'fetch_single') {
		var id = request.body.id;

		var query = `SELECT * FROM USERS WHERE USER_ID = "${id}"`;

		database.query(query, function (error, data) {

			response.json(data[0]);

		});
	}

	if (action == 'Edit') {
		var id = request.body.id;
		var name = request.body.name;
		var role = request.body.role;
		var level = request.body.level;
		var email = request.body.email;
		var phone = request.body.phone;
		var pass = request.body.password;

		var query = `
		UPDATE USERS 
		SET NAME = "${name}", 
		ROLE = "${role}", 
		LEVEL = "${level}", 
    EMAIL = "${email}",
		PHONE = "${phone}",
    PASS = "${pass}",
		UPDATE_DATE = CURRENT_TIMESTAMP
		WHERE USER_ID = "${id}"
		`;

		database.query(query, function (error, data) {
			response.json({
				message: `Usuario ${name} ha sido editado exitosamente`
			});
		});
	}

	if (action == 'delete') {
		var id = request.body.id;

		var query = `DELETE FROM USERS WHERE USER_ID = "${id}"`;

		database.query(query, function (error, data) {

			response.json({
				message: `Usuario eliminado exitosamente`
			});

		});
	}

});

module.exports = router;
