
const express = require("express");
const { home, signup, signin, logout } = require('../controllers/homeControllers');
const router = express.Router()
const bcrypt = require('bcrypt');
// home route
router.get('/', home)

// Sign up route
router.post('/signup', signup);

// Sign in route
router.post('/signin', signin);

//logout route
router.get('/logout', logout);

router.use((req, res, next) => {
    res.status(404).render('error', { message: `Page ${req.url} not found`, buttonUrl: '/', buttonText: 'Go back to home' });
});

module.exports = router