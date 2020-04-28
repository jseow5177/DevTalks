const express = require('express');
const router = express.Router();

// Require register and login logic
const { registerUser, loginUser } = require('../helper/user');

router.post('/login', async (req, res) => {

    await loginUser(req, res);

});

router.post('/register', async (req, res) => {

    await registerUser(req, res);

});



module.exports = router;