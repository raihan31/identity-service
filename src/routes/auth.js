const express = require('express');
const {login, signup, refreshToken, logout} = require('../controllers/authController');


const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;
