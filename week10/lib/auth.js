var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../models/user');

module.exports = function (app, options) {
    return {
        // two methods
        init: function () {


            // passport-local function
            passport.use(new LocalStrategy(User.authenticate()));
            // describe how Passport should store/find user data
            // from the Session cookie
            passport.serializeUser(function (user, done) {
                done(null, user._id);
            });

            passport.deserializeUser(function (id, done) {
                User.findById(id, function (err, user) {
                    if (err || !user) return done(err, null);
                    done(null, user);
                });
            });


            // Telling passport to start and add to session
            app.use(passport.initialize());
            // allows for persistent login sessions
            app.use(passport.session());

            app.use(function (req, res, next) {
                // add user to res.locals
                // passport adds req.user
                // we can use res.locals.user in our views
                res.locals.user = req.user;
                next();
            });
        },

        registerRoutes: function () {
            //display the signup page
            app.get('/signup', function (req, res) {
                res.render('signup', {
                    viewName: 'Sign up'
                })
            });
            //handle the FORM SUBMISSION
            app.post('/signup', function (req, res, next) {
                var newUser = new User({
                    username: req.body.username
                });

                User.register(newUser, req.body.password, function (err, user) {
                    if (err) {
                        console.log('Error creating new user', err);
                        return res.render('signup', {
                            flash: {
                                type: 'negative',
                                header: 'Signup Error',
                                body: err.message
                            },
                            viewName: 'Sign Up'
                        });
                    }
                    // if success...
                    passport.authentication('local')(req, res, function () {
                        req.session.flash = {
                            type: 'positive',
                            header: 'Registration Success',
                            body: 'Welcome, ' + user.username
                        }
                        res.redirect('/');
                    });
                });
            });
            //display the login page
            app.get('/login', function (req, res) {
                res.render('signup', {
                    viewName: 'Log In'
                })
            });
            //
            app.post('/login', function (req, res, next) {
                req.session.flash = {
                    type: 'positive',
                    header: 'Signed in',
                    body: 'Welcome, ' + req.body.username
                };

                res.redirect('/');
            });

            app.get('/logout', function (req, res) {
                req.logout();
                req.session.flash = {
                    type: 'positive',
                    header: 'Signed out',
                    body: 'Successfully logged out'
                }
            })
        }
    };
};
