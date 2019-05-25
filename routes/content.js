const express = require('express');
const router = express.Router();
const db = require('../models');

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const s3 = new aws.S3();

const cloudStorage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  ACL: 'public-read',
  metadata: function (request, file, ab_callback) {
    ab_callback(null, { fieldname: file.fieldname });
  },
  key: function (request, file, ab_callback) {
    const newFileName = 'content/' + file.originalname + "-" + Date.now();
    ab_callback(null, newFileName);
  },
});

const upload = multer({
  storage: cloudStorage
});

router.use(function (req, res, next) {
  console.log("USE", req.file, req.files);
  next();
});



router.post('/add', upload.single('imgFile'), (req, res) => {
  console.log("QUERY", req.query)

  upload.single('imgFile')

  let {id} = req.query
  if (req.file) id = req.file.key;

    const content = {
        id: id,
        name: req.query.name,
        description: req.query.description,
        type: req.query.type,
        PageId: req.query.pageId
      }
    
      db.Content.create(content)
        .then(resp => {
          res.status(200);
          res.json({ success: true, message: 'Content created!'});
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: "Internal server error.", error: err });
        })

})

router.get('/search', (req, res) => {

  let query = { where: {}}

  if (req.query.id) query.where.id = req.query.id


  db.Content.findAll(query)
    .then(resp => {
      res.json({ success: true, message: 'Content found!', response: resp, EMBEDLY_API_KEY: process.env.EMBEDLY_API_KEY });
    })
    .catch(err => {
      console.error("ERR", err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })
})

module.exports = router;
