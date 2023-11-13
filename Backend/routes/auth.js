const express = require('express');
const router = express.Router();
const User = require('../model/Users');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config=require('config');
const jwtSecretToken = process.env.jwtSecretToken;
const auth=require('../middleware/auth');

/**
 * @description Get user details route
 */
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); //finding user by its id 
        res.json(user);  //it will give user details route
        //res.send('Auth route')
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }

});

/**
 * @description login route
 */
router.post('/', [
    check('email', 'Please incude a valid email').isEmail(), //by using express-validator we are checking validation 
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req); //if there is any error then error will be stored in array form 

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const { email, password } = req.body; // extracting email and password from body

    try {
        let user = await User.findOne({ email }); //finding user by its email
        if (!user) { //if there is no user registerd with email then Invalid credential will be uploaded 
            return res.status(400).json({
                errors: [{ msg: 'Invalid Credentials' }]
            })
        }

        const isMatch = await bcrypt.compare(password, user.password); // comapring password with stored password which is in hashed form 

        if (!isMatch) { //if password does not match then user will not be allowed to login
            return res.status(400).json({
                errors: [{ msg: 'Invalid Credentials' }]
            })
        }
        // user logged in succesfully
        const payload = {
            user: {
                id: user.id //storing its user id in payload 
            }
        }
        //providing a unique token to user 
        jwt.sign(
            payload,
            jwtSecretToken,
            { expiresIn: 360000 }, //expires token if this time limit reached
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;