const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');

// Require input validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

// Load user model
const User = require('../models/User');

const registerUser = async (req, res) => {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Check if email exists
    try {
        const foundUserWithSameEmail = await User.findOne({ email: req.body.email });

        if (foundUserWithSameEmail) {
            return res.status(400).json({ email: 'Email already exists' });
        } else {

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                channels: [],
                starred: []
            });

            bcrypt.genSalt(10, async (err, salt) => {
                if (err) {
                    return res.status(500).json({ message: 'genSalt error' });
                }
                const hash = await bcrypt.hash(newUser.password, salt);
                newUser.password = hash;
                await newUser.save();
                // Upon successful sign up, user immediately log ins
                return res.status(200).json({ email: req.body.email, password: req.body.password });
            });
        }
    } catch (err) {
        return res.status(500).json({ message: error.message });
    }

}

const loginUser = async (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        const foundUser = await User.findOne({ email: email });
        // Check if user exists
        if (!foundUser) {
            return res.status(404).json({ emailNotFound: 'Email not found' });
        } else {
            // Compare password
            const isMatch = await bcrypt.compare(password, foundUser.password);
            // Password matched and create jwt payload
            if (isMatch) {
                const jwt_payload = {
                    id: foundUser._id,
                    username: foundUser.username
                }
                // Sign token with secret key. Token expires in 30 days
                jwt.sign(jwt_payload, keys.secretOrKey, { expiresIn: '30d' }, (err, token) => {
                    return res.status(200).json({ success: true, token: `Bearer ${token}` })
                });
            } else {
                return res.status(400).json({ passwordIncorrect: 'Password incorrect' });
            }
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

const findUser = async (req, res, byId) => {
    let userId;

    if (byId) { // If a GET request, access userId from req.params
        userId = req.params.userId;
    } else { // If a POST request, access userId from req.body
        const userInfo = req.body.userData; // userId, username
        userId = userInfo.userId;
    }

    try {
        const foundUser = await User.findOne({ _id: userId });
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return foundUser;
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

module.exports = { registerUser, loginUser, findUser }