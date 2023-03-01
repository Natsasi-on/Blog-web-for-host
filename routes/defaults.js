const express = require('express');
const router = express.Router();



router.get('/about', function (req, res) {
    res.render('about');
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.get('/categories', function (req, res) {
    res.render('categories');
});

//ส่งไปapp.js
module.exports = router;