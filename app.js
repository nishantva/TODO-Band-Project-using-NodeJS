const express = require('express');
const expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser')



// DB Config
const conn = require('./server')
const flash = require('connect-flash');
const session = require('express-session')
const passport = require('passport');

const app = express();

//Passport Config
require('./config/passport')(passport);

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express Session
app.use(session({
  secret: 'secret cat',
  resave: true,
  saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/bands', require('./routes/bands'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started on port ${PORT}`));