require("dotenv").config();
const db = require("../models");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const auth = require("../controllers/auth");

const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const s3 = new aws.S3();

const cloudStorage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  ACL: "public-read",
  metadata: function(request, file, ab_callback) {
    ab_callback(null, { fieldname: file.fieldname });
  },
  key: function(request, file, ab_callback) {
    const newFileName =
      "images/profile/users/" + file.originalname + "-" + Date.now();
    ab_callback(null, newFileName);
  }
});

const upload = multer({
  storage: cloudStorage
});

function getHash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function getSalt() {
  return crypto.randomBytes(16).toString("hex");
}

let BASE_URL = "";
switch (process.env.NODE_ENV) {
  case "testing":
    BASE_URL = process.env.TESTING_URL;
    break;
  case "development":
    BASE_URL = process.env.DEV_URL;
    break;
  case "production":
    BASE_URL = process.env.PROD_URL;
    break;
}

const role = "user";

// Register a new user
router.post("/register", upload.single("imgFile"), (req, res) => {
  let imageLink = "";
  if (req.file) imageLink = req.file.key;

  const salt = getSalt();
  const hash = getHash(req.query.password, salt);

  const user = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    email: req.query.email.toLowerCase(),
    hash: hash,
    salt: salt,
    phone: req.query.phone,
    summary: req.query.summary,
    imageLink: imageLink,
    remember: req.query.remember
  };

  let AWS = "N/A";
  if (req.file) AWS = "Image uploaded!";

  db.User.create(user)
    .then(resp => {
      res.status(200);
      res.json({
        success: true,
        message: "User created!",
        token: auth.generateJWT(resp, role),
        AWS: AWS
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error.", error: err });
    });
});

router.post("/login", (req, res) => {
  let role = "user";

  db.User.findOne({
    where: {
      phone: req.query.phone
    }
  })
    .then(resp => {
      const user = resp.dataValues;
      res.json({
        success: true,
        message: "Logged in!",
        token: auth.generateJWT(user, role)
      });
    })
    .catch(err => {
      console.error("ERR", err);
      res.status(500).json({ message: "Internal server error.", error: err });
    });
});

router.put("/password", async (req, res) => {
  try {
    const { password, email } = req.body;
    await passport.authenticate("local");
    console.log(password, email, "pwemail");
    const user = await User.findOne({ email }).exec();
    console.log(user, "iserss");
    user.password = password;
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error, "err<-");
    res.send({ error: `${error}` });
  }
});

router.get("/search", (req, res) => {
  let query = {
    where: {},
    include: [
      {
        model: db.Page
      }
    ]
  };
  if (req.query.id) query.where.id = req.query.id;
  if (req.query.profile) query.where.profile = req.query.profile;

  db.User.findAll(query)
    .then(resp => {
      res.json({
        success: true,
        message: "User(s) found!",
        response: resp,
        BASE_URL: BASE_URL,
        bucket: process.env.S3_BUCKET
      });
    })
    .catch(err => {
      console.error("ERR", err);
      res.status(500).json({ message: "Internal server error.", error: err });
    });
});

// Update a user
router.put("/update", upload.single("imgFile"), (req, res) => {
  console.log("REQ", req.file);

  let imageLink = req.query.imageLink;
  if (req.file) imageLink = req.file.key;

  const user = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    title: req.query.title,
    email: req.query.email,
    profile: req.query.profile,
    phone: req.query.phone,
    summary: req.query.summary,
    imageLink: imageLink,
    instagram: req.query.instagram,
    facebook: req.query.facebook,
    twitter: req.query.twitter,
    linkedin: req.query.linkedin,
    whatsapp: req.query.whatsapp,
    website: req.query.website,
    remember: req.query.remember
  };

  let AWS = "N/A";
  if (req.file) AWS = "Image uploaded!";

  db.User.update(user, { where: { id: req.query.id } })
    .then(resp => {
      res.status(200);
      res.json({
        success: true,
        message: "User created!",
        token: auth.generateJWT(resp),
        AWS: AWS
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error.", error: err });
    });
});

module.exports = router;
