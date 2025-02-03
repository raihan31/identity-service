const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const redisClient = require('../config/redis');
const passport = require('passport');




const signup = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = new User({email, password});
        await user.save();
        res.status(201).json({message: 'User created successfully'});
    } catch (err) {
        res.status(500).json({message: 'Error signing up'});
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
        const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH});
        await redisClient.set(user._id.toString(), refreshToken, {EX: process.env.JWT_REFRESH_EXPIRE});
        res.status(200).json({accessToken, refreshToken});
    } catch (err) {
        res.status(500).json({message: 'Error logging in'});
    }
}

const refreshToken = async (req, res) => {
    try {
        const {refreshToken} = req.body;
        if (!refreshToken) {
            return res.status(401).json({message: 'Unauthorized'});
        }
        jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, user) => {
            if (err) {
                return res.status(403).json({message: 'Invalid token'});
            }
            const token = await redisClient.get(user.id.toString());
            if (token !== refreshToken) {
                return res.status(403).json({message: 'Invalid token'});
            }
            const accessToken = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
            const newRefreshToken = jwt.sign({id: user.id}, process.env.REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH});
            await redisClient.set(user.id.toString(), newRefreshToken, {EX: process.env.JWT_REFRESH_EXPIRE});
            res.status(200).json({accessToken, refreshToken: newRefreshToken});
        });
    } catch (err) {
        res.status(500).json({message: 'Error refreshing token'});
    }
}


const logout = async (req, res) => {
    try {
        const {userId} = req.body;
        await redisClient.del(id.toString());
        res.status(200).json({message: 'User logged out successfully'});
    } catch (err) {
        res.status(500).json({message: 'Error logging out'});
    }
}

const googleAuth = passport.authenticate('google',{ scope: ['profile', 'email'] });

const googleAuthCallback = passport.authenticate('google', {
    successRedirect: '/api/auth/success',
    failureRedirect: '/api/auth/failure',
})

const authSuccess = (req, res) => {
    if( !req.user ) {
        return res.status(401).json({message: 'Unauthorized'});
    }
    res.status(200).json({message: 'Google successfully logged in', user: req.user});
}

const authFailure = (req, res) => {
    res.status(401).json({message: 'Google auth failed with error'});
}



module.exports = {signup, login, logout, refreshToken, googleAuth, googleAuthCallback, authSuccess, authFailure};