// load modules
var express = require('express');
var hbs = require('express-handlebars');
//var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
//Passport for facebook login
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
// load .env
require('dotenv').config();

// create app
var app = express();
var PORT = process.env.PORT || 8081;

// Cookie Secret in .env
<<<<<<< Updated upstream
//app.use(cookieParser(process.env.cookieSecret));
=======
>>>>>>> Stashed changes
app.use(cookieParser());

// creating Session
app.use(session({
    secret: process.env.cookieSecret,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 24 * 7
    },
    //Updates the session even if there were no updates
    resave: false,
    //Creates a new session for every user
    saveUninitialized: true,
    // add session store
    store: new MongoStore({
        url: process.env.DB_URL
    })
}));

app.use(function (req, res, next) {
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

// init handlebars
app.engine('handlebars', hbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// setup cookierParser and bodyParser before our routes
<<<<<<< Updated upstream
// that depend on them
// add form fields to req.body, ie.e. req.body.username
=======
>>>>>>> Stashed changes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// connect to database
mongoose.connect(process.env.DB_URL);


<<<<<<< Updated upstream
// LOCAL AUTHORIZATION SETUP, SEE /lib/auth.js FOR FUNCTIONS
=======
>>>>>>> Stashed changes
var options = {};
var auth = require('./lib/auth')(app, options);
auth.init(); // setupmiddleware
auth.registerRoutes();

<<<<<<< Updated upstream
// FACEBOOK AUTHORIZATION SETUP
// Facbook Login Stratgey using passport-facebook
=======
// Facebook authorization 
>>>>>>> Stashed changes
passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientPassword: process.env.FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:8081/auth/facebook/callback'
    },
    function (accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
            facebookId: profile.id
        }, function (err, user) {
            return cb(err, user);
        });
    }
));
<<<<<<< Updated upstream
// OAuth for Facebook.
// Routes to and from Auth provider
// redirect TO - FACEBOOK
app.get('/auth/facebook', passport.authenticate('facebook'));

// callback FROM - FACEBOOK
=======
// Facebook OAuth

// redirecting to facebook
app.get('/auth/facebook', passport.authenticate('facebook'));

// facebook callback 
>>>>>>> Stashed changes
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/');
    });
<<<<<<< Updated upstream
// END OF FACEBOOK AUTHORIZATION



// BEGIN HOME PAGE, COOKIES
=======




// home page 
>>>>>>> Stashed changes
app.get('/', function (req, res) {
    if (req.session.treat) {
        return res.render('view', {
            msg: 'You have a treat: ' + req.session.treat
        });
    }
<<<<<<< Updated upstream
    //        if (req.signedCookies.treat) {
    //            return res.render('view', {
    //                msg: 'You have a treat: ' + req.signedCookies.treat
    //            });
    //        }
=======

>>>>>>> Stashed changes
    return res.render('view', {
        msg: 'No treats.'
    });
});

<<<<<<< Updated upstream
// cookie creation
=======
// create cookies
>>>>>>> Stashed changes
app.get('/treat', function (req, res) {
    req.session.treat = 'candy corn'
    req.session.flash = {
        type: 'positive',
        header: 'You got a treat',
        body: 'the treat is ' + req.session.treat
    };
<<<<<<< Updated upstream
    //    res.cookie('treat', 'candy corn',{
    //        httpOnly: true,
    ////        signed: true
    //    });
    res.redirect('/');
});

// cookie deletion
=======

    res.redirect('/');
});

// delete cookies
>>>>>>> Stashed changes
app.get('/clear', function (req, res) {
    delete req.session.treat;
    //res.clearCookie('treat');
    req.session.flash = {
        type: 'negative',
        header: 'No treat',
        body: 'Your bag is empty'
    };
    //delete req.cookies.treat;
    res.redirect('/');
});



<<<<<<< Updated upstream
// start server
=======
//port 
>>>>>>> Stashed changes
app.listen(PORT, function () {
    console.log('listening on port ', PORT);
});
