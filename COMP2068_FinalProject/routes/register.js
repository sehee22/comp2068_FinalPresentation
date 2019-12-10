'use strict';
var express = require('express');
var router = express.Router();
var Account = require('../models/account');

// Sehee: uploading an image
var multer = require('multer');
var storageDetails = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storageDetails });


/* Grab register page. */
router.get('/', function (req, res) {
    res.render('register');
});

/* Create Account. */
router.post('/', upload.single('img'), function (req, res) {
    // if a file has been uploaded
    // Sehee: (req.file.originalname != undefined) -> req.file
    if (req.file) {
        Account.create({
            username: req.body.username,
            password: req.body.password,
            phone: req.body.phone,
            img: '../uploads/' + req.file.originalname
            //Sehee: img: "public\\uploads\\" + req.file.originalname -> img: '../uploads/' + req.file.originalname
        }, function (err, Account) {
            if (err) {
                console.log(err)
            }
            else {
                console.log(req.file);
                console.log("New user " + Account + " added");
                res.render('login', { file: '../uploads/' + req.file.originalname });
            }
        });
    }
    else {
        Account.create({
            username: req.body.username,
            password: req.body.password,
            phone: req.body.phone
        }, function (err, Account) {
            if (err) {
                console.log(err)
            }
            else {
                console.log(req.file);
                console.log("New user " + Account + " added");
                res.render('login'); //sehee: pass account info
            }
        });
    }
});

module.exports = router;
