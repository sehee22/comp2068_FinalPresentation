'use strict';
var express = require('express');
var router = express.Router();
var Account = require('../models/account');

router.get('login', function (req, res, next) {

    //check is already login 
    if (req.session.loggedIn) {
        next();
    } else {
        var admin = "admin", password = "admin"; // or db values
        if (req.body.username === admin && req.body.password === password) {
            req.session.loggedIn = true;
            res.redirect('/');
        } else {
            res.render('login', { title: "Login Here" });
        }
    }
});

router.get('logout', function (req, res, next) {

    req.session.loggedIn = false;
    res.redirect('/');
});

module.exports = router;
