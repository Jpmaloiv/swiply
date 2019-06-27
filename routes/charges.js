
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
    order: [['createdAt', 'DESC']],
    include: [{
      model: db.Page,
      include: [{
        model: db.User
      }]
    }, {
      model: db.Customer
    }]
  }


  if (req.query.name) {
    if (req.query.name.trim().indexOf(' ') != -1) {
      const name = req.query.name.split(' ')
      query = {
        where: {
          '$Page.User.id$': req.query.id,
          [Op.or]: [{
            '$Customer.firstName$': {
              [Op.like]: '%' + name[0] + '%'
            }
          }, {
            '$Customer.lastName$': {
              [Op.like]: '%' + name[1] + '%'
            }
          }]
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
    } else {
      console.log(req.query.name, "NAME")
      query = {
        where: {
          [Op.or]: [{
            '$Customer.firstName$': {
              [Op.like]: '%' + req.query.name + '%'
            }
          }, {
            '$Customer.lastName$': {
              [Op.like]: '%' + req.query.name + '%'
            }
          }]
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
    }
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