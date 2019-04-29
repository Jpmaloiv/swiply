
require('dotenv').config();
const db = require('../models');
const express = require('express');
const router = express.Router();

const auth = require("../controllers/auth");

// Send SMS verification
router.post('/send', (req, res) => {
    auth.verifyPhone(req, res)
})

// Verify if user's phone number exists in database
router.post('/verify', (req, res) => {

    db.User.findOne({
        where: {
            phone: req.query.phone
        }
    })
        .then(resp => {
            if (resp != null) {
                auth.verifyPhone(req, res)
            } else {
                res.json({ success: false, message: 'User not found.' });
            }
        })
        .catch(err => {
            console.error("ERR", err);
            res.status(500).json({ message: "Internal server error.", error: err });
        })
})

module.exports = router;