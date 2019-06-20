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
  metadata: function (req, file, ab_callback) {
    ab_callback(null, { fieldname: file.fieldname });
  },
  key: function (req, file, ab_callback) {
    let user = req.query.userName.split(' ')
    const newFileName = `content/${user[1]}-${user[0]}/${req.query.pageId}/` + file.originalname + "-" + Date.now();
    ab_callback(null, newFileName);
  },
});

const upload = multer({
  storage: cloudStorage
});

router.use(function (req, res, next) {
  next();
});



router.post('/add', upload.single('imgFile'), (req, res) => {

  upload.single('imgFile')

  let { link } = req.query
  if (req.file) link = req.file.key;

  const content = {
    name: req.query.name,
    description: req.query.description,
    link: link,
    type: req.query.type,
    fileLink: req.query.fileLink,
    PageId: req.query.pageId
  }

  db.Content.create(content)
    .then(resp => {
      res.status(200);
      res.json({ success: true, message: 'Content created!', id: resp.dataValues.id });

    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })

})


router.post('/attach', upload.single('imgFile'), (req, res) => {

  upload.single('imgFile')
  console.log("FILE", req.file)

  const content = {
    name: req.query.name,
    description: req.query.description,
    link: req.file.key,
    FileId: req.query.fileId,
    PageId: req.query.pageId
  }

  db.Content.create(content)
    .then(resp => {
      res.status(200);
      res.json({ success: true, message: 'Content attachment created!' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })

})

router.get('/search', (req, res) => {

  let query = {
    where: {},
    include: [{
      model: db.Content,
      as: 'File'
    }]
  }

  if (req.query.id) query.where.id = req.query.id

  db.Content.findAll(query)
    .then(resp => {
      res.json({ success: true, message: 'Content found!', response: resp, EMBEDLY_API_KEY: process.env.EMBEDLY_API_KEY, s3Bucket: process.env.S3_BUCKET });
    })
    .catch(err => {
      console.error("ERR", err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })
})


module.exports = router;
