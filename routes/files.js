var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('files', {
    title: 'Express'
  });
});

router.post('/upload', 
  fileUpload({ createParentPath: true}),
  (req, res) => {
    const files = req.files
    if (!files) return res.json({ status: "empty", message: "Seleccione un archivo antes de publicar" })
    else{
      console.log(files)
      Object.keys(files).forEach(key => {
      const filename = files[key].name
      const filebody = files[key].data

      
    })
      return res.json({status: 'success', message: Object.keys(files).toString()+' publicado'})
    }
  }

)

module.exports = router;
