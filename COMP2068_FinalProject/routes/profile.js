//Code by Sehee
'use strict';
var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var username = "";

// uploading an image
var multer = require('multer');
var storageDetails = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storageDetails });

/* GET profile page. */
router.get('/', isLoggedIn, function (req, res) {

    if (req.query.username != null) {
        Account.findOne({ username: req.query.username }
            , function (err, account) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('profile', { username: account.username, phone: account.phone, img: account.img, id: account.id });
                }
            });
    }
    // if we are coming from a page that isn't immediately after logging in, use the username variable we saved when we logged in before
    else {
        console.log("Attempting to render profile from a page other than login")
        console.log("Getting account for user '" + username + "'");
        Account.findOne({ username : username }
            , function (err, account) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('profile', { username: account.username, phone: account.phone, img: account.img, id: account.id });
                }
            });
    }

});

/* POST profile page. */
router.post('/', isLoggedIn, upload.single('img'), function (req, res) {
    var editedAccount = {
        username: req.body.username,
        phone: req.body.phone,
        img: req.body.orgImg,
        id: req.body.id
    };

    // console.log(req.body.orgImg);

    if (req.file) {
            editedAccount.img= '../uploads/' + req.file.originalname
    }

    Account.updateOne({ _id: req.body.id }, editedAccount, function (err) {
        if (err) {
            res.send('Account: ' + req.body.username + ' not found!');
        }
        else {
            console.log('Account ' + req.body.username + ' updated!');
            username = editedAccount.username;
            res.render('profile', { id: editedAccount.id, username: editedAccount.username, phone: editedAccount.phone, img: editedAccount.img });
        }
    })
});

//////////////////////////////////////////////////////
// tyler's new code 12/01/19

// password reset form
router.get('/passwordReset/:id', function (req, res) {
    var id = req.params.id;

    Account.findById(id, function (err, product) {
        if (err) {
            res.send('Account with id of ' + id + ' not found!');
        }
        else {
            res.render('passwordReset', { id: id });
        }
    });
});

// password reset database update
router.post('/passwordReset', function (req, res) {
    var id = req.body.id;

    var userForm = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
        newPasswordConfirm: req.body.newPasswordConfirm
    };

    console.log("");
    console.log("USER'S SUBMITTED FORM: ")
    console.log(userForm)
    console.log("");

    Account.findById(id, function (err, account) {
        if (err) {
            console.log("----couldn't find entry with id of '" + id + "'----")
        }
        else {
            console.log("DATABASE ENTRY FOR THIS ID: ");
            console.log(account)
            console.log("");

            // if the user's old password matches to what we have in the database...
            if (userForm.oldPassword == account.password) {
                // and if the user's new password fields match...
                if (userForm.newPassword == userForm.newPasswordConfirm) {

                    var editedAccount = {
                        _id: id,
                        username: account.username,
                        password: userForm.newPassword,
                        phone: account.phone,
                        img: account.img
                    }

                    Account.updateOne({ _id: id }, editedAccount, function (err) {
                        if (err) {
                            res.send('Account with id of ' + id + ' not found!');
                        }
                        else {
                            res.render('profilePasswordChanged');
                        }
                    });         
                }
                // else if the user's new password fields DO NOT match...
                else {
                    // tell them so and let them retry
                    res.render('passwordResetWrongMatch', { id: id })
                }
            }
            // if the user's old password DOES NOT match to what we have in the database...
            else {
                // tell them so and let them retry
                res.render('passwordResetWrongOld', { id: id })
            }
        }
    });
});

// end of tyler's new code 12/01/19
//////////////////////////////////////////////////////

//Is the user logged in?
function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        console.log("authentication passes")

        // if we have been authenticated, define which user we are
        if (req.query.username != undefined) {
            console.log("a");
            username = req.query.username;

            console.log("logging in as '" + username + "'");
        }
        return next();
    }
    else {
        console.log('Not authenticated!');
        res.redirect('/login');
    }

}


module.exports = router;
