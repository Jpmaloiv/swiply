
const express = require('express');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


router.post('/create', (req, res) => {

    stripe.accounts.create({
        email: 'joe@funbarn.com',
        country: 'us',
        type: 'custom',
        requested_capabilities: ['card_payments'],
        business_type: 'individual',
        individual: {
            
        }
    })
        .then(res => console.log(res))
        .catch(err => console.error(err))

})

module.exports = router;
