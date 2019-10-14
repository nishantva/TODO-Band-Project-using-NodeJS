const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');

const bcrypt = require('bcryptjs');
const passport = require('passport');

// User Model
const UserDB = require('../server');

var {
    User
} = UserDB

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const {
        name,
        email,
        company,
        dob,
        password,
        password2
    } = req.body;

    let errors = [];

    // Check Required Fields
    if (!name || !email || !company || !dob || !password || !password2) {
        errors.push({
            msg: 'Please Fill in All Fields'
        });
    }

    // Check Password Match
    if (password !== password2) {
        errors.push({
            msg: 'Passwords do not match'
        })
    }

    // Check Password Length
    if (password.length < 6) {
        errors.push({
            msg: 'Password should be at least 6 characters'
        });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            company,
            dob,
            password,
            password2
        });
    } else {
        // Validation Passed
        User.findOne({
                where: {
                    email: email
                }
            })
            .then(user => {
                if (user) {
                    //User Exists
                    errors.push({
                        msg: 'Email is already Registered'
                    })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        company,
                        dob,
                        password,
                        password2
                    });
                } else {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(password, salt, function (err, hash) {
                            if (err) throw err;
                            else {
                                User.build({
                                    Name: name,
                                    Company: company,
                                    DOB: dob,
                                    Email: email,
                                    Password: hash
                                }).save().then(() => {})
                            }
                        })
                    })
                    req.flash('success_msg', 'You are now registered And Can Log In');
                    res.redirect('/users/login');
                }
            });
    }


});

//Login Handle
router.post('/login', (req, res, next) => {

    //Set Data in session:
    req.session.email = req.body.email
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);

});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are Logged Out');
    res.redirect('/users/login');
});


module.exports = router;