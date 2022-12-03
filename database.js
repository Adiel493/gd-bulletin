const mysql = require('mysql');

var connection = mysql.createConnection({
	host:"gd.cvzzlgerihu7.us-east-1.rds.amazonaws.com",
    user:"admin",
    password:"admin123.",
    database:"gd_bulletin"
});

connection.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('MySQL Database is connected Successfully');
	}
});

module.exports = connection;