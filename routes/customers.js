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
  metadata: function (request, file, ab_callback) {
    ab_callback(null, { fieldname: file.fieldname });
  },
  key: function (request, file, ab_callback) {
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

function getHash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function getSalt() {
  return crypto.randomBytes(16).toString("hex");
}

const role = "customer";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Register a new customer
router.post("/register", upload.single("imgFile"), async (req, res) => {
  // let imageLink = "";
  // if (req.file) imageLink = req.file.key;
  // console.log("REQ", req.query)

  console.log("QUERY", req.query)

  const salt = getSalt();
  const hash = getHash(req.query.password, salt);

  const charge = await stripe.charges.create({
    amount: req.query.price,
    currency: "usd",
    source: req.query.token,
  }, {
      stripe_account: req.query.accountId,
    }).then(function (charge, err) {
      if (charge) console.log("CHARGE", charge)
      else console.log("ERROR", err)
    });

    return

  const customer = {
    // firstName: req.query.firstName,
    // lastName: req.query.lastName,
    email: req.query.email.toLowerCase(),
    imageLink: imageLink,
    hash: hash,
    salt: salt
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

// Update a customer
router.put("/update", upload.single("imgFile"), async (req, res) => {
  console.log("REQ", req.file);

  let imageLink = req.query.imageLink;
  if (req.file) imageLink = req.file.key;

  const customer = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    email: req.query.email,
    profile: req.query.profile,
    imageLink: imageLink
  };

  // Check if old password was entered correctly
  if (req.query.oldPassword) {
    await db.Customer.findOne({
      where: {
        email: req.query.email
      }
    })
      .then(resp => {
        let inputHash = getHash(req.query.oldPassword, resp.salt);
        console.log("HASH", inputHash.toString(), resp.hash);

        if (inputHash === resp.hash) {
          console.log("HASHLAND")
          customer.salt = getSalt();
          let salt = customer.salt
          customer.hash = getHash(req.query.password, salt);
        } else {
          return res.json({ message: "Wrong original password" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: "Customer not found", error: err });
      });
  }

  if (req.query.token) {
    customer.salt = getSalt();
    let salt = customer.salt;
    customer.hash = getHash(req.query.password, salt);
    customer.passwordResetToken = ''
  }

  let AWS = "N/A";
  if (req.file) AWS = "Image uploaded!";

  db.Customer.update(customer, { where: { id: req.query.id } })
    .then(resp => {
      res.status(200);
      res.json({
        success: true,
        message: "Customer updated!",
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
