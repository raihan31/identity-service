const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('./config/mongoose');
const redisClient = require('./config/redis');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home');

dotenv.config();
const app = express();
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session(undefined));

app.use('/', homeRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;