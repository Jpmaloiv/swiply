
require('dotenv').config();
const db = require('../models');
const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');

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
  console.log("QUERY", req.query)

  let query = {
    where: {},
    include: [{
      model: db.User
    }, {
      model: db.Content
    }],
  }

  if (req.query.pageId) {
    query = {
      where: { id: req.query.pageId },
      include: [{
        model: db.User
      }, {
        model: db.Content,
        required: false,
        where: { fileId: null }
      }]
    }
  }

  if (req.query.published) query.where.published = true
  if (req.query.userId) query.where.UserId = req.query.userId

  console.log("SORT", req.query.sort)

  // Sort pages
  switch (req.query.sort) {
    case 'views':
      query.order = [['views', 'DESC']];
      break;
    case 'date':
      query.order = [['createdAt', 'DESC']];
      break;
    case 'revenue':
      query.order = [['revenue', 'DESC']];
      break;
    case 'convRatio':
      query.order = [[sequelize.literal('purchases / views DESC')]]
  }

  const revenue = db.Page.sum('revenue', query)
  const views = db.Page.sum('views', query)
  // const followers = 
  
  // const convRatio = sequelize.query(
  //   'SELECT AVG("purchases" / "views") FROM "Page"',
  //   { type: sequelize.QueryTypes.SELECT}
  // ).then(function(result) {
  //   console.log("RES", result)
  //     // process result here
  // })


  console.log("QUERY", query)
  db.Page.findAll(query)
    .then(resp => {
      res.json({ success: true, message: 'Pages found!', response: resp, bucket: process.env.S3_BUCKET, revenue: revenue, views: views });
    })
    .catch(err => {
      console.error("ERR", err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })
})


router.put('/update', upload.single('imgFile'), (req, res) => {

  console.log("UPDATE", req.query)
  upload.single('imgFile')

  const page = {
    name: req.query.name,
    description: req.query.description,
    summary: req.query.summary,
    price: req.query.price,
    position: req.query.position,
    published: req.query.published,
    displayProfile: req.query.displayProfile,
    order: req.query.order
  }

  if (req.file) page.imageLink = req.file.key;

  let AWS = 'N/A'
  if (req.file) AWS = 'Image uploaded!'

  console.log("PAGE", page)
  // Increment page view count
  if (req.query.view) db.Page.increment('views', { where: { id: req.query.id } })

  db.Page.update(page, { where: { id: req.query.id } })
    .then(resp => {
      res.status(200);
      res.json({ success: true, message: 'Page updated!', AWS: AWS });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })
})


router.delete("/delete", (req, res) => {

  db.Page.destroy({
    where: {
      id: req.query.id
    }
  })
    .then(function (resp) {
      res.json({ success: true });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).end(err.toString());
    });
});


module.exports = router;