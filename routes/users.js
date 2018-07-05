var express    = require('express'),
    router     = express.Router({ mergeParams: true }),
    middleware = require('../middleware'),
    Campground = require('../models/campground'),
    User       = require('../models/user');

// USER PROFILE
router.get('/', (req, res) => {
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

// EDIT PROFILE - edit a specific profile
router.get('/edit', middleware.checkUser, (req, res) => {
    User.findById(req.params.id, (err, foundUser) =>{
        if (err || !foundUser) {
            console.log(err);
            req.flash('error', 'That user does not exist');
            res.redirect('back');
        }
        else {
            res.render('users/edit', {user: foundUser});
        }
    });
});

// UPDATE - update a specific profile
router.put('/', middleware.checkUser, middleware.checkAvatar, (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body.user, (err, updatedUser) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            req.flash('success', 'Updated user');
            res.redirect('/users/' + req.params.id);
        }
    });
});

// DESTROY - delete a user
router.delete('/', middleware.checkUser, (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            req.flash('success', 'Deleted ' + deletedUser.username);
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;
