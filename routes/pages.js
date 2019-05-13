
require('dotenv').config();
const db = require('../models');
const express = require('express');
const router = express.Router();

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
    const newFileName = 'images/pages/' + file.originalname + "-" + Date.now();
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


router.post("/add", upload.single('imgFile'), function (req, res) {

  console.log("FILE", req.file, req.files)

  upload.single('imgFile')

  let imageLink = ''
  if (req.file) imageLink = req.file.key;

  const page = {
    name: req.query.name,
    description: req.query.description,
    summary: req.query.summary,
    imageLink: imageLink,
    UserId: req.query.userId
  }

  let AWS = 'N/A'
  if (req.file) AWS = 'Image uploaded!'

  db.Page.create(page)
    .then(resp => {
      res.status(200);
      res.json({ success: true, message: 'Page created!', AWS: AWS });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })
})


router.get('/search', (req, res) => {

  let query = {
    where: {},
    include: [
      {
        model: db.User
      }, {
        model: db.Content
      }
    ]
  }
  if (req.query.pageId) query.where.id = req.query.pageId
  if (req.query.published) query.where.published = true
  if (req.query.userId) query.where.UserId = req.query.userId

  console.log("QUERY", query)
  db.Page.findAll(query)
    .then(resp => {
      res.json({ success: true, message: 'Pages found!', response: resp, bucket: process.env.S3_BUCKET });
    })
    .catch(err => {
      console.error("ERR", err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })
})


router.put('/update', (req, res) => {

  const page = {
    name: req.query.name,
    description: req.query.description,
    summary: req.query.summary,
    price: req.query.price,
    published: req.query.published
  }

  let AWS = 'N/A'
  if (req.file) AWS = 'Image uploaded!'

  db.Page.update(page, { where: { id: req.query.id } })
    .then(resp => {
      res.status(200);
      res.json({ success: true, message: 'Page created!', AWS: AWS });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })
})


module.exports = router;