require("dotenv").config();
const db = require("../models");
const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const crypto = require("crypto");
const axios = require('axios')
const qs = require('qs')

const auth = require("../controllers/auth");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
templates = {
  password_reset: process.env.SENDGRID_EMAIL_TEMPLATE_PASSWORD_RESET,
};

function getHash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

const role = "user";

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


// User login
router.post("/login", (req, res) => {

  const { password, role } = req.query;

  if (req.query.role === 'user') {
    db.User.findOne({
      where: {
        email: req.query.email
      }
    })
      .then(function (resp) {
        if (resp) {
          let inputHash = getHash(password, resp.salt);
          console.log(inputHash.toString(), resp.hash);
          if (inputHash === resp.hash) {
            res.json({ success: true, token: auth.generateJWT(resp, role) });
          } else {
            res.json({ success: false, message: 'User not found' })
          }
        } else {
          res.json({ success: false, message: 'User not found' })
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error.", error: err });
      });
  } else {
    db.Customer.findOne({
      where: {
        email: req.query.email
      }
    })
      .then(function (resp) {
        if (resp) {
          let inputHash = getHash(password, resp.salt);
          console.log(inputHash.toString(), resp.hash);
          if (inputHash === resp.hash) {
            res.json({ success: true, token: auth.generateJWT(resp, role) });
          } else {
            res.json({ success: false, message: 'Customer not found' })
          }
        } else {
          res.json({ success: false, message: 'Customer not found' })
        }
      })
      .catch(function (err) {
        console.log(err);
        res.status(500).json({ message: "Customer not found", error: err });
      });
  }
})

router.post('/reset-password', async (req, res) => {

  const { role } = req.query
  console.log("ROLE", role)

  let userQuery

  if (role === 'user')
    userQuery = await db.User.findOne({
      where: {
        email: req.query.email
      }
    })
  else if (role === 'customer')
    userQuery = await db.Customer.findOne({
      where: {
        email: req.query.email
      }
    })

  if (userQuery) {
    const token = crypto.randomBytes(64).toString('hex');

    const msg = {
      to: req.query.email,
      from: process.env.SWIPLY_EMAIL,
      templateId: templates['password_reset'],
      dynamic_template_data: {
        name: userQuery.firstName,
        reset_password_url: `${BASE_URL}/reset-password/${token}`
      }
    }

    const user = {
      passwordResetToken: token,
    }

    sgMail.send(msg)
      .then(resp => {
        console.log("Successfully sent password reset email")

        if (role === 'user')
          db.User.update(user, { where: { id: userQuery.id } })
            .then(resp => {
              console.log(resp)
              res.status(200).json({ success: true, message: 'Password reset token set for user', response: resp })
            })
            .catch(err => {
              console.error(err);
              res.status(500).json({ message: "Error setting password reset token for user", error: err });
            });
        else if (role === 'customer')
          db.Customer.update(user, { where: { id: userQuery.id } })
            .then(resp => {
              console.log(resp)
              res.status(200).json({ success: true, message: 'Password reset token set for customer', response: resp })
            })
            .catch(err => {
              console.error(err);
              res.status(500).json({ message: "Error setting password reset token for customer", error: err });
            });
      })
      .catch(err => console.error("Error sending password reset email"))

  }
  else {
    console.log('No user found');
    res.status(200).json({ success: false, message: 'No user found' })
  }
})

router.get('/token', async (req, res) => {

  let query = { where: {} }
  if (req.query.token) query.where.passwordResetToken = req.query.token;


  let role = ''
  let resp = await db.User.findOne(query)
  if (resp) role = 'user'
  else resp = await db.Customer.findOne(query)
  if (resp && role !== 'user') role = 'customer'

  if (resp) res.json({ success: true, message: `User found!`, response: resp, role })
  else res.json({
    success: false,
    message: "No users found",
  });
})


// Grants customer access to a page
router.post("/page", (req, res) => {
  db.Customer.findByPk(req.query.customerId)
    .then(customer => {
      customer
        .addPage(req.query.pageId)
        .then(resp => {
          res.status(200).json({ message: "Page access granted!" });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ message: "Internal server error.", error: err });
        });
    });
});



module.exports = router;
