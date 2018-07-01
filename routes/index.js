var express  = require('express'),
    router   = express.Router(),
    passport = require('passport'),
    User     = require('../models/user');

// ROOT ROUTE
router.get('/', (req, res) => {
  res.render('landing');
});

// AUTH ROUTES

// show register form
router.get('/register', (req, res) => res.render('register'));

// handle sign up logic
router.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

// LOGIN ROUTES

// show login form
router.get('/login', (req, res) => res.render('login'));

// handle login logic
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login'
    }), (req, res) => {
});

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

module.exports = router;
