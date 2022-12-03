var express = require('express');
var router = express.Router();
var database = require('../database')
const PDF = require('pdfkit-construct');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('reports', {
    title: 'Express'
  });
});

router.post("/action", function (request, response, next) {

  var action = request.body.action;

  if (action == 'fetch_names') {
    var query = "SELECT * FROM USERS WHERE ROLE = 'ALUMNO' AND IS_ACTIVE = 1 ORDER BY NAME";

    database.query(query, function (error, data) {

      response.json({
        data: data
      });

    });
  }

});


router.get('/generatePDF', async function (req, res, next) {
  var doc = new PDF({
    bufferPages: true
  });
  var id = req.query.id;

  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();

  var date_format = year + "-" + month + "-" + date;

  var queryStudent = `SELECT * FROM USERS WHERE USER_ID = "${id}"`;
  var queryGrades = `SELECT s.SUBJECT_NAME, g.PACE_NUMBER, g.GRADE, DATE_FORMAT(g.DATE,'%d/%m/%Y') AS DATE FROM GRADES g JOIN SUBJECTS s ON g.SUBJECT_ID = s.SUBJECT_ID WHERE USER_ID = "${id}" AND g.GRADE != 0 ORDER BY s.SUBJECT_NAME, g.PACE_NUMBER`;

  const student = await new Promise((resolve) => {
    database.query(queryStudent, (err, res) => {
      resolve(res)
    });
  });

  const scores = await new Promise((resolve) => {
    database.query(queryGrades, (err, res) => {
      resolve(res)
    });
  });

  const grades = scores.map((score) => {
    const grade = {
      subject: score.SUBJECT_NAME,
      pace: score.PACE_NUMBER,
      grade: score.GRADE,
      date: score.DATE
    }
    return grade;
  })


  var stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-disposition': `attachment;filename=${student[0].NAME}`
  });

  doc.on('data', (data) => {
    stream.write(data)
  });
  doc.on('end', () => {
    stream.end()
  });

  // doc.image('/images/logo.png', 320, 280, {scale: 0.25})
  //  .text('Scale', 320, 265);

  doc.setDocumentHeader({
    height: '18'
  }, () => {
    doc.fontSize(14).text('PROGRESS REPORT', {
      width: 420,
      align: 'center',
    });

    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Alumno: ${student[0].NAME}`, {
      width: 420,
      align: 'right'
    });
    doc.text(`Nivel: ${student[0].LEVEL}`, {
      width: 420,
      align: 'right'
    });
    doc.text(`Fecha: ${date_format}`, {
      width: 420,
      align: 'right'
    });
  });


  doc.addTable([{
      key: 'subject',
      label: 'Subject',
      align: 'center'
    },
    {
      key: 'pace',
      label: 'PACE',
      align: 'center'
    },
    {
      key: 'grade',
      label: 'Grade',
      align: 'center'
    },
    {
      key: 'date',
      label: 'Date',
      align: 'center'
    }
  ], grades, {
    border: null,
    width: "fill_body",
    striped: true,
    stripedColors : ["#F2F2F2", "#FFFFFF"],
    cellsPadding: 10,
    marginLeft: 45,
    marginRight: 45,
    headAlign: 'center'
  });

  doc.render();
  doc.end();

});


module.exports = router;