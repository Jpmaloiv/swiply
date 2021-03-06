const db = require("../models");
const express = require('express');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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


router.post('/register', async (req, res) => {

  const accountId = await stripe.oauth.token({
    client_secret: req.query.client_secret,
    code: req.query.code,
    grant_type: 'authorization_code'
  })
    .then(resp => {
      console.log("Token received", resp.stripe_user_id)
      return resp.stripe_user_id
    })
    .catch(err => console.log("ERR", err))

  const user = {
    accountId: accountId,
  }

  db.User.update(user, { where: { id: req.query.id } })
    .then(resp => {
      console.log("User updated!")
      res.status(200);
      res.json({
        success: true,
        message: "User updated!",
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error.", error: err });
    });
})


router.post('/login', (req, res) => {
  stripe.accounts.createLoginLink(req.query.accountId)
    .then(resp => {
      console.log('Login link generated', resp)
      res.json({ stripeLink: resp.url })
    })
    .catch(err => console.error('Error creating login link', err))
})


router.post('/charge', async (req, res) => {
  console.log("HERE", req.query)

  const charge = {
    CustomerId: req.query.id,
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
        console.log("CHARGE", charge)
        return charge
      })
      .catch(err => console.log("Error charging customer", err))

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
      res.json({ success: true, message: 'Charge created!' });
    })
    .catch(err => {
      console.error('Error creating charge', err);
      res.status(500).json({ message: "Internal server error.", error: err });
    })

  // Increment page revenue and purchase count
  db.Page.increment('revenue', { by: charge.amount, where: { id: req.query.pageId } })
  db.Page.increment('purchases', { where: { id: req.query.pageId } })
})


module.exports = router;
