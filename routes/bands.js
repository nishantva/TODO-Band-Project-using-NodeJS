const route = require('express').Router()
// User Model
const UserDB = require('../server');

var {
    band
} = UserDB

route.get('/', function (req, res) {
    res.render('bands', {
        bands
    })
})

route.post('/create', function (req, res) {
    let name = req.body.name
    let desc = req.body.desc
    band.build({
        Title: name,
        Description: desc,
        UserEmail: req.session.passport.user.Email
    }).save().then((band) => {
        fetchBands(req, res)
    })
})

route.post('/update/:id', function (req, res) {
    let id = req.params.id
    let name = req.body.name
    let desc = req.body.desc
    band.update({
        Title: name,
        Description: desc,
    }, {
        where: {
            id: Number(id)
        }
    }).then((band) => {
        fetchBands(req, res)
    })
})

route.get('/delete/:id', function (req, res) {
    let id = req.params.id

    band.destroy({
        where: {
            id: Number(id)
        }
    }).then((band) => {
        fetchBands(req, res)
    })
})

function fetchBands(req, res) {
    getBands(req.session.passport.user.Email, bands => {
        res.render('dashboard', {
            name: req.session.passport.user.Name,
            data: bands
        })
    })
}

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


module.exports = route