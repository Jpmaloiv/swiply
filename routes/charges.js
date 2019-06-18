
require('dotenv').config();
const db = require('../models');
const express = require('express');
const router = express.Router();


router.get('/search', (req, res) => {

  let query = {
    where: {},
    include: [
      {
        model: db.Page
      }, {
        model: db.Customer
      }
    ]
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