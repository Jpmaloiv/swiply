
const express = require('express');
const router = express.Router();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


router.post('/subscribe', async (req, res) => {

    stripe.subscriptions.create({
        customer: "cus_FGKAHQYPlIrLap",
        items: [
            {
                plan: "plan_FGJmbUTlXiCjYe",
            },
        ]
    }, function (err, subscription) {
        if (err) console.log("ERR", err)
        else console.log("SUB", subscription)
    }
    );

})


module.exports = router;
