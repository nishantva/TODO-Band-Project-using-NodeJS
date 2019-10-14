const LocalStrategy = require('passport-local').Strategy;
const server = require('../server').connection;
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../server').User;

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            //Match User
            User.findOne({
                    where: {
                        email: email
                    }
                })
                .then(user => {


                    user = user.get({
                        plain: true
                    })

                    if (!user) {
                        return done(null, false, {
                            message: 'That Email is not Registered'
                        });
                    }
                    //Match Password
                    bcrypt.compare(password, user.Password, (err, iMatch) => {
                        if (err) throw err;

                        if (iMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, {
                                message: 'Password incorrect'
                            });
                        }

                    })
                })
                .catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({
            id: id
        }).then((user) => {
            if (!user) {
                return done(new Error("No such User"))
            }
            return done(null, user)
        }).catch((err) => {
            done(err)
        })
    });
}