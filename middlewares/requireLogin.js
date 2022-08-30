const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('891305350714-liornsh72r91g1vklnk4f38s85aphgt4.apps.googleusercontent.com');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    // authorization === Bearer jwt_token
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in1" }); // code 401 means unauthorized
    }
    const token = authorization.replace("Bearer ", "");
    // console.log("requireLogin token -----", token)
    // jwt.verify(token, JWT_SECRET, (err, payload) => {
    //     if (err) {
    //         return res.status(403).json({ error: "You must be logged in2" });
    //     }
    //     const { _id } = payload;
    //     User.findById(_id).then((userData) => {
    //         req.user = userData;
    //         next();
    //     });
    // });

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            requiredAudience: '891305350714-liornsh72r91g1vklnk4f38s85aphgt4.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log('uid: ' + userid);
        User.find({ id: userid }).then((userData) => {
            console.log('user found-----', userData[0]);
            req.user = userData[0];
            next();
        });
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
    }

    verify().catch(err => console.error("idToken verifyIdToken error: " + err));

    console.log('ho gya verifyIdToken');
}
