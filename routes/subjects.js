var express = require('express');
var router = express.Router();
var database = require('../database')

router.get('/', function (request, response, next) {
	response.render('subjects');
});

router.post("/action", function (request, response, next) {

	var action = request.body.action;

	if (action == 'fetch') {
		var query = "SELECT * FROM SUBJECTS ORDER BY CATEGORY, LOW_RANGE";

		database.query(query, function (error, data) {

			response.json({
				data: data
			});

		});
	}

	if (action == 'Add') {
		var subject_name = request.body.subject;
		var category = request.body.category;
		var level = request.body.level;
		var low_range = request.body.low_range;
		var high_range = request.body.high_range;
		var credits = request.body.credits;
		var color = request.body.color;

		var query = `
		INSERT INTO SUBJECTS 
		(SUBJECT_NAME, CATEGORY, LEVEL, CREDITS, LOW_RANGE, HIGH_RANGE, COLOR) 
		VALUES ("${subject_name}", "${category}", "${level}", "${credits}", "${low_range}", "${high_range}", "${color}")
		`;

		database.query(query, function (error, data) {

			response.json({
				message: `Materia ${subject_name} agregada exitosamente `
			});

		});
	}

	if (action == 'fetch_single') {
		var id = request.body.id;

		var query = `SELECT * FROM SUBJECTS WHERE SUBJECT_ID = "${id}"`;

		database.query(query, function (error, data) {

			response.json(data[0]);

		});
	}

	if (action == 'Edit') {
		var id = request.body.id;
		var subject_name = request.body.subject;
		var category = request.body.category;
		var level = request.body.level;
		var low_range = request.body.low_range;
		var high_range = request.body.high_range;
		var credits = request.body.credits;
		var color = request.body.color;

		var query = `
		UPDATE SUBJECTS 
		SET SUBJECT_NAME = "${subject_name}", 
		CATEGORY = "${category}", 
		LEVEL = "${level}", 
    	CREDITS = "${credits}",
		LOW_RANGE = "${low_range}",
    	HIGH_RANGE = "${high_range}",
		COLOR = "${color}"
		WHERE SUBJECT_ID = "${id}"
		`;

		database.query(query, function (error, data) {
			response.json({
				message: `${subject_name} ha sido editada exitosamente`
			});
		});
	}

	if (action == 'delete') {
		var id = request.body.id;

		var query = `DELETE FROM SUBJECTS WHERE SUBJECT_ID = "${id}"`;

		database.query(query, function (error, data) {

			response.json({
				message: `Materia eliminada exitosamente`
			});

		});
	}

});



module.exports = router;