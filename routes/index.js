const fs = require('fs');
const path = require('path');
const basename = path.basename(module.filename);
const express = require('express');
const router = express.Router();



router.get('/', async function (req, res, next) {
  return res.json({
    success: true,
    message: "Welcome to the Swiply API",
  })
});

router.get('/env', async function (req, res, next) {

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

  return res.json({
    stripeClientId: process.env.STRIPE_CLIENT_ID,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    baseUrl: BASE_URL
  })
});

// reads current directory and adds routes to router
fs.readdirSync(__dirname)
  .filter(file => {
    // if file is not hidden
    return (file.indexOf('.') !== 0)
      // if its not the current file
      && (file !== basename)
      // if it is a .js file
      && (file.slice(-3) === '.js')
      // if it doesnt have multiple breaks e.g. users.old.js
      && (file.split('.').length === 2)
  })
  .forEach(file => {
    file = file.split('.')
    const route = '/' + file[0]
    router.use(route, require('.' + route))
  });

module.exports = router;
