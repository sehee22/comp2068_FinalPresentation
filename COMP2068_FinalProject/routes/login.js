'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');

// get login page
router.get('/', isLoggedIn, function (req, res) {
    res.render('login');
});

// attempt login using passport
// Sehee edited for a profile page
router.post('/', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/profile/?username=' + req.body.username); 
        });
    })(req, res, next);

});

//Is the user logged in?
// Sehee: without below code, anyone can see the profile page
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        return next();
    }

}
module.exports = router;
