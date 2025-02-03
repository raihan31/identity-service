const express = require('express');
const {login, signup, refreshToken, logout, googleAuth, googleAuthCallback, authFailure, authSuccess} = require('../controllers/authController');


const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.get('/success', authSuccess);
router.get('/failure', authFailure);




module.exports = router;
