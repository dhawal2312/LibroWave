const jwt = require('jsonwebtoken');
const config=require('config');

const jwtSecretToken = process.env.jwtSecretToken
module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' })
    }

    //verify token
    try {
        const decoded = jwt.verify(token, jwtSecretToken);//here we are verifying token with token which is given while login
        req.user = decoded.user; //here we are making user information available to the rest of application
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}