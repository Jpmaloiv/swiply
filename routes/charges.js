
require('dotenv').config();
const db = require('../models');
const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize')

const Op = Sequelize.Op


router.get('/search', (req, res) => {

  let query = {
    where: {
      '$Page.User.id$': req.query.id
    },
    include: [{
      model: db.Page,
      include: [{
        model: db.User
      }]
    }, {
      model: db.Customer
    }]
  }

  console.log("QUERY", query)
  db.Charge.findAll(query)
    .then(resp => {
      res.json({ success: true, message: 'Pages found!', response: resp, bucket: process.env.S3_BUCKET });
    })
    .catch(err => {
      console.error("ERR", err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })
})


module.exports = router;