const jwt = require("jsonwebtoken");


module.exports = {

    // Generates local storage token
    generateJWT(user) {
        let expire = new Date();
        expire.setDate(expire.getDate() + 7);
        return jwt.sign({
            id: user.id,
            email: user.email,
            name: user.firstName + ' ' + user.lastName,
            profile: user.profile,
            exp: expire.getTime() / 1000
        }, process.env.JWT_SECRET)
    },

    /* Sends verification code to phone with Twilio SMS */
    verifyPhone(req, res) {

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);

        const verifyCode = Math.floor(1000 + Math.random() * 9000);

        client.messages.create(
            {
                to: req.query.phone,
                from: '+19495064604',
                body: "Here's your confirmation code for PV3:" + verifyCode,
            },
            (err, message) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({ message: "Internal server error.", error: err });
                } else {
                    console.log(message.sid);
                    res.status(200).json({ success: true, message: "Verification code sent!", verifyCode: verifyCode });
                }
            })
    }

    // AWS pre-signed URL
}