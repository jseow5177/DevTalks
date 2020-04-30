const express = require('express');
const router = express.Router();

const { registerUser, loginUser, findUser } = require('../helper/user');

router.post('/login', async (req, res) => {

    await loginUser(req, res);

});

router.post('/register', async (req, res) => {

    await registerUser(req, res);

});

// Get user info 
router.get('/:userId', async (req, res) => {

    const foundUser = await findUser(req, res, byId = true);

    return res.status(200).json(foundUser);

});



module.exports = router;