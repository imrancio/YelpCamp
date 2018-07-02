var express    = require('express'),
    router     = express.Router(),
    passport   = require('passport'),
    User       = require('../models/user'),
    Campground = require('../models/campground');

// ROOT ROUTE
router.get('/', (req, res) => {
  res.render('landing');
});

// AUTH ROUTES

// show register form
router.get('/register', (req, res) => res.render('register', {page: 'register'}));

// handle sign up logic
router.post('/register', (req, res) => {
    var newUser = new User(
        {
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            avatar: req.body.avatar
        });
    if (req.body.adminCode === 'GodricGryffindorWillSlaySlytherinHouse!!!') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to YelpCamp ' + user.username);
            res.redirect('/campgrounds');
        });
    });
});

// LOGIN ROUTES

// show login form
router.get('/login', (req, res) => res.render('login', {page: 'login'}));

// handle login logic
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) => {

});

// LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/campgrounds');
});

// USER PROFILE
router.get('/users/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        }
        Campground.find().where('author.id').equals(foundUser._id).exec((err, campgrounds) => {
            if (err) {
                console.log(err);
                req.flash('error', 'Something went wrong');
                res.redirect('back');
            }
            res.render('users/show', {user: foundUser, campgrounds: campgrounds, page: 'profile'});
        });

    });
});

module.exports = router;
