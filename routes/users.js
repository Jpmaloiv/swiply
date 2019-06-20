require("dotenv").config();
const db = require("../models");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const auth = require("../controllers/auth");

const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const s3 = new aws.S3();

const cloudStorage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  ACL: "public-read",
  metadata: function (request, file, ab_callback) {
    ab_callback(null, { fieldname: file.fieldname });
  },
  key: function (request, file, ab_callback) {
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

// Check if user already exists in database
router.post('/verify', (req, res) => {

  db.User.findOne({
    where: {
      email: req.query.email
    }
  })
    .then(function (resp) {
      if (resp) res.status(200).json({ message: 'Duplicate user found', response: resp })
      else res.status(200).json({ message: 'No user data found', response: resp })

    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error.", error: err });
    });
})


// Register a new user
router.post("/register", upload.single("imgFile"), async (req, res) => {

  let { plan } = req.query

  if (plan === 'medium') plan = process.env.PRICING_PLAN_MEDIUM
  if (plan === 'pro') plan = process.env.PRICING_PLAN_PRO

  if (plan !== 'small') {
    const customer = await stripe.customers.create({
      description: `Customer for ${req.query.email}`,
      source: req.query.token,
    })
      .then(resp => {
        console.log('Customer created:', resp.id)
        return resp
      })
      .catch(err => console.error(err))

    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: plan }]
    })
      .then(resp => {
        console.log('Subscription created:', resp.id)
      })
      .catch(err => console.error(err))
  }

  let imageLink = "";
  if (req.file) imageLink = req.file.key;

  const salt = getSalt();
  const hash = getHash(req.query.password, salt);

  const user = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    email: req.query.email.toLowerCase(),
    title: req.query.title,
    profile: req.query.profile,
    hash: hash,
    salt: salt,
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
        userId: resp.dataValues.id,
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
      email: req.query.email
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
    include: [{ model: db.Page }]
  };
  if (req.query.id) query.where.id = req.query.id;
  if (req.query.profile) query.where.profile = req.query.profile;

  db.User.findAll(query)
    .then(resp => {
      if (resp.length > 0) {
        res.json({
          success: true,
          message: "User(s) found!",
          response: resp,
          BASE_URL: BASE_URL,
          bucket: process.env.S3_BUCKET
        });
      } else {
        res.json({
          success: false,
          message: "No users found",
          response: resp,
        });
      }
    })
    .catch(err => {
      console.error("ERR", err);
      res.status(500).json({ message: "Internal server error.", error: err });
    });
});

// Update a user
router.put("/update", upload.single("imgFile"), async (req, res) => {
  console.log("REQ", req.query);

  let imageLink = req.query.imageLink;
  if (req.file) imageLink = req.file.key;

  const user = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    title: req.query.title,
    email: req.query.email,
    profile: req.query.profile,
    summary: req.query.summary,
    imageLink: imageLink,
    instagram: req.query.instagram,
    facebook: req.query.facebook,
    twitter: req.query.twitter,
    linkedIn: req.query.linkedIn,
    whatsapp: req.query.whatsapp,
    website: req.query.website,
    remember: req.query.remember
  };

  // Check if old password was entered correctly
  if (req.query.oldPassword) {
    await db.User.findOne({
      where: {
        email: req.query.email
      }
    })
      .then(resp => {
        if (resp) {
          let inputHash = getHash(req.query.oldPassword, resp.salt);
          console.log("HASH", inputHash.toString(), resp.hash);

          if (inputHash === resp.hash) {
            console.log("HASHLAND")
            user.salt = getSalt();
            let salt = user.salt
            user.hash = getHash(req.query.password, salt);
          } else {
            return res.json({ message: "Wrong original password" });
          }
        } else {
          res.status(200).json({ message: 'User not found' })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal server error", error: err });
      });
  }

  if (req.query.token) {
    user.salt = getSalt();
    let salt = user.salt;
    user.hash = getHash(req.query.password, salt);
    user.passwordResetToken = ''
  }

  console.log("MADE IT")
  let AWS = "N/A";
  if (req.file) AWS = "Image uploaded!";

  console.log("USER", user)

  db.User.update(user, { where: { id: req.query.id } })
    .then(resp => {
      res.status(200);
      res.json({
        success: true,
        message: "User updated!",
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
