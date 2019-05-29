require("dotenv").config();
const db = require("../models");
const express = require("express");
const router = express.Router();

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
      "images/profile/customers/" + file.originalname + "-" + Date.now();
    ab_callback(null, newFileName);
  }
});

const upload = multer({
  storage: cloudStorage
});

let BASE_URL = "";
switch (process.env.NODE_ENV) {
  case "testing":
    BASE_URL = process.env.TEST_URL;
    break;
  case "development":
    BASE_URL = process.env.DEV_URL;
    break;
  case "production":
    BASE_URL = process.env.PROD_URL;
    break;
}

const role = "customer";

// Register a new customer
router.post("/register", upload.single("imgFile"), (req, res) => {
  let imageLink = "";
  if (req.file) imageLink = req.file.key;

  const customer = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    email: req.query.email.toLowerCase(),
    phone: req.query.phone,
    imageLink: imageLink
  };

  let AWS = "N/A";
  if (req.file) AWS = "Image uploaded!";

  db.Customer.create(customer)
    .then(resp => {
      res.status(200);
      res.json({
        success: true,
        message: "Customer created!",
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
  let role = "customer";

  db.Customer.findOne({
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

router.get("/search", (req, res) => {
  let query = {
    where: {},
    include: {
      model: db.Page,
      as: "pages"
    }
  };
  if (req.query.id) query.where.id = req.query.id;
  if (req.query.profile) query.where.profile = req.query.profile;
  
  
  db.Customer.findAll(query)
    .then(resp => {
      res.json({
        success: true,
        message: "Customer(s) found!",
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

  const customer = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    email: req.query.email,
    profile: req.query.profile,
    phone: req.query.phone,
    imageLink: imageLink
  };

  let AWS = "N/A";
  if (req.file) AWS = "Image uploaded!";

  db.Customer.update(customer, { where: { id: req.query.id } })
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

module.exports = router;
