
require('dotenv').config();
const db = require('../models');
const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');

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
        const newFileName = 'images/profile/' + file.originalname + "-" + Date.now();
        ab_callback(null, newFileName);
    },
});

const upload = multer({
    storage: cloudStorage
});


// Register a new user
router.post('/register', upload.single('imgFile'), (req, res) => {

    const user = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
        email: req.query.email.toLowerCase(),
        phone: req.query.phone,
        summary: req.query.summary,
        imageLink: req.file.key,
        remember: req.query.remember
    }

    let AWS = 'N/A'
    if (req.file) AWS = 'Image uploaded!'

    db.User.create(user)
        .then(resp => {
            res.status(200);
            res.json({ success: true, message: 'User created!', token: auth.generateJWT(resp), AWS: AWS });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error.", error: err });
        })
})

router.post('/login', (req, res) => {

    db.User.findOne({
        where: {
            phone: req.query.phone
        }
    })
        .then(resp => {
            const user = resp.dataValues;
            res.json({ success: true, message: 'Logged in!', token: auth.generateJWT(user) });
        })
        .catch(err => {
            console.error("ERR", err);
            res.status(500).json({ message: "Internal server error.", error: err });
        })
})


module.exports = router;