const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/authentication')

// User Model
const UserDB = require('../server');

var {
    band
} = UserDB
//Welcome Page
router.get('/', (req, res) => res.render('welcome'));

//Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    getBands(req.session.passport.user.Email, data => {
        res.render('dashboard', {
            name: req.session.passport.user.Name,
            data: data
        })
    })
});

function getBands(username, callback) {
    band.findAll({
        where: {
            UserEmail: username
        }
    }).then(bands => {
        callback(bands.map(b => b.get({
            plain: true
        })))
    })
}
module.exports = router;