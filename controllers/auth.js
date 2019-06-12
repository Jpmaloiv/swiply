const jwt = require("jsonwebtoken");


module.exports = {

    // Generates local storage token
    generateJWT(user, role) {
        console.log("ROLE", role)
        let expire = new Date();
        expire.setDate(expire.getDate() + 7);
        return jwt.sign({
            id: user.id,
            email: user.email,
            name: user.firstName + ' ' + user.lastName,
            role: role,
            profile: user.profile,
            exp: expire.getTime() / 1000
        }, process.env.JWT_SECRET)
    },
}