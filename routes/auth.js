require("dotenv").config();
const db = require("../models");
const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const crypto = require("crypto");

const auth = require("../controllers/auth");

function getHash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

const role = "user";


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



// Grants customer access to a page
router.post("/page", (req, res) => {
  db.Customer.findByPk(req.query.customerId).then(customer => {
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
