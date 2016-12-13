var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('../models/user');

module.exports = function(app) {
    return {
        init: function() {
            passport.use(new LocalStrategy(User.authenticate()));

            passport.serializeUser(function(user, done) {
                done(null, user._id);
            });
            
            passport.deserializeUser(function(id, done) {
                User.findById(id, function(err, user) {
                    if (err || !user) {
                      return done(err, null);
                    }
                    done(null, user);
                });
            });
            
            app.use(passport.initialize());
            app.use(passport.session());
            
            app.use(function(req, res, next) {
                // add user to res.locals
                // passport adds req.user
                // we can use res.locals.user in our views
                res.locals.user = req.user;
                next();
            });
        },
        
        registerRoutes: function() {
            app.get('/signup', function(req, res) {
                res.render('signup');
            });

            app.post('/signup', function(req, res, next) {
                var newUser = new User({
                    username: req.body.username
                });

                User.register(newUser, req.body.password, function(err, user) {
                    if (err) {
                        //Check if user already exists
                        if (err.name === 'UserExistsError') {
                            return res.render('signup', {message: 'Username already exists'});
                        } else {
                            console.log('signup error: ', err);
                            return res.render('signup', {message: 'Error signing up'});
                        }
                    }

                    passport.authenticate('local')(req, res, function() {
                        res.redirect('/');
                    });
                });
            });
            
            app.get('/login', function(req, res) {
                res.render('login');
            });
            //if login successful, redirect. 
            app.post('/login', passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/login'
            }));

            app.get('/logout', function(req, res) {
                req.logout();
                res.redirect('/');
            });
        }
    };
};