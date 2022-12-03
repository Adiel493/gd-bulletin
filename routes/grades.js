var express = require('express');
var router = express.Router();
var database = require('../database')

router.get('/', function(req, res, next) {
  res.render('grades');
});

router.post("/action", function(request, response, next){

	var action = request.body.action;

	if(action == 'fetch_names')
	{
		var query = "SELECT * FROM USERS WHERE ROLE = 'ALUMNO' AND IS_ACTIVE = 1 ORDER BY NAME";

		database.query(query, function(error, data){

			response.json({
				data:data
			});

		});
	}

  if(action == 'fetch_grades')
  {
    var id = request.body.id;
    
		var query = `SELECT g.SUBJECT_ID, g.GRADE_ID, g.GRADE, g.PACE_NUMBER, g.DATE, s.SUBJECT_NAME, s.COLOR
    FROM GRADES g JOIN SUBJECTS s 
    ON g.SUBJECT_ID = s.SUBJECT_ID
    WHERE USER_ID = "${id}"`;

		database.query(query, function(error, data){

			response.json({
				data:data
			});

		});
  }

  if(action == 'edit'){
    var id = request.body.id;
    var grade = request.body.grade;

    var query = `
		UPDATE GRADES
		SET GRADE = "${grade}" 
		WHERE GRADE_ID = "${id}"
		`;

		database.query(query, function (error, data) {
			response.json({
				message: `Calificación ha sido editada exitosamente`
			});
		});
  }

  if (action == 'Add') {
	var subject_id = request.body.subject;
	var start_pace = request.body.begin;
	var user_id = request.body.id;

	var query = `
	INSERT INTO GRADES
	(SUBJECT_ID, PACE_NUMBER, USER_ID) 
	VALUES ("${subject_id}", "${start_pace}", "${user_id}")
	`;

	database.query(query, function (error, data) {

		response.json({
			message: `Materia agregada exitosamente `
		});

	});
}

if (action == 'fetch_subject_info') {
	var id = request.body.id;

	var query = `
	SELECT SUBJECT_ID, SUBJECT_NAME FROM SUBJECTS WHERE SUBJECT_ID NOT IN
	(SELECT DISTINCT(SUBJECT_ID) FROM GRADES WHERE USER_ID = "${id}")
	`;

	database.query(query, function (error, data) {

		response.json({
			data:data
		});

	});
}

if (action == 'fetch_number_info') {
	var id = request.body.id;

	var query = `
	SELECT HIGH_RANGE, LOW_RANGE FROM SUBJECTS WHERE SUBJECT_ID = "${id}"
	`;

	database.query(query, function (error, data) {

		response.json({
			data:data
		});

	});
}

if (action == 'comparison') {
	var id = request.body.id;

	var query = `
	SELECT MAX(g.PACE_NUMBER) AS MAX, s.HIGH_RANGE FROM GRADES g JOIN SUBJECTS s ON g.SUBJECT_ID = s.SUBJECT_ID WHERE g.SUBJECT_ID = "${id}"
`;

	database.query(query, function (error, data) {

		response.json({
			data: data
		});

	});
}

if (action == 'add_cell') {
	var subject_id = request.body.subject;
	var pace_number = request.body.number;
	var user_id = request.body.user;

	var query = `
	INSERT INTO GRADES
	(SUBJECT_ID, PACE_NUMBER, USER_ID) 
	VALUES ("${subject_id}", "${pace_number}", "${user_id}")
	`;

	database.query(query, function (error, data) {

		response.json({
			message: `Materia agregada exitosamente `
		});

	});
}


});


module.exports = router;