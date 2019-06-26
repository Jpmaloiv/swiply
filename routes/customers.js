require("dotenv").config();
const db = require("../models");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const axios = require('axios')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const auth = require("../controllers/auth");

const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
  console.log("QUERY", req.query)

  const salt = getSalt();
  const hash = getHash(req.query.password, salt);

  const customer = {
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    email: req.query.email.toLowerCase(),
    hash: hash,
    salt: salt
  };

  let token = ''


  const customerId = await db.Customer.create(customer)
    .then(resp => {
      token = auth.generateJWT(resp, role)
      return resp.id
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error.", error: err });
    });

  const charge = {
    CustomerId: customerId,
    PageId: req.query.pageId
  }
  
  const t = req.query.token.trim()

  console.log(t)

  if (t !== 'undefined') {

    const purchase = await stripe.charges.create({
      amount: (req.query.price * 100).toFixed(0),
      currency: "usd",
      source: req.query.token.trim(),
      transfer_data: {
        destination: req.query.accountId,
      }
    })
      .then(charge => {
        console.log("Initial charge created for customer", charge)
        return charge
      })
      .catch(err => console.log("Error creating initial charge for customer", err))

    charge.id = purchase.id
    charge.amount = purchase.amount / 100
  } else {
    charge.id = Math.floor(Math.random() * 90000) + 10000;
    charge.amount = 0
  }

  await db.Charge.create(charge)
    .then(resp => {
      console.log("RESP", resp)
      res.status(200);
      res.json({ success: true, message: 'Customer and charge created!', customerId: customerId, token: token });
    })
    .catch(err => {
      console.error('Error creating charge', err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })

  console.log('AMOUNT', amount)

  // Increment page revenue and purchase count
  db.Page.increment('revenue', { by: amount, where: { id: req.query.pageId } })
  db.Page.increment('purchases', { where: { id: req.query.pageId } })
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


  if (req.query.userId) {
    query = {
      where: {
        '$Charges.Page.UserId$': req.query.userId
      },
      include: [{
        model: db.Charge,
        include: [{
          model: db.Page,
        }]
        // as: 'pages',
        // include: [{
        //   model: db.User
        // }]
      }]
    }
  }

  if (req.query.name) {
    query = {
      where: {
        firstName: req.query.name
      }
    }
  }

  // if (req.query.name) {
  //   if (req.query.name.trim().indexOf(' ') != -1) {
  //     const names = req.query.name.split(' ');
  //     const firstName = names[0];
  //     const lastName = names[1];

  //     query = {
  //       where: {
  //         [Op.and]: [{
  //           firstName: {
  //             $like: '%' + firstName + '%'
  //           }
  //         }, {
  //           lastName: {
  //             $like: '%' + lastName + '%'
  //           }
  //         }]
  //       }
  //     }
  //   } else {
  //     query = {
  //       where: {
  //         [Op.and]: [{
  //           [Op.or]: [{
  //             firstName: {
  //               like: '%' + req.query.name + '%'
  //             }
  //           }, {
  //             lastName: {
  //               like: '%' + req.query.name + '%'
  //             }
  //           }]
  //         }]
  //       }
  //     }
  //   }
  // }

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


// Contact customer support
router.post('/contact-us', (req, res) => {

  const msg = {
    to: process.env.SUPPORT_EMAIL,
    from: req.query.email,
    subject: 'Swiply - Customer Support Inquiry',
    html: `${req.query.email} - <br /><br />` + req.query.message
  }

  sgMail.send(msg)
    .then(resp => {
      console.log("Successfully sent inquiry email")
      res.status(200).json({ success: true, message: 'Successfully sent inquiry email', response: resp })
    })
    .catch(err => {
      console.error("Error sending inquiry email", err)
      res.status(500).json({ success: false, message: 'Error sending inquiry email', error: err })
    })
})


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
