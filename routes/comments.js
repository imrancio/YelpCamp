var express = require('express'),
    router  = express.Router({mergeParams: true}),
    Campground = require('../models/campground'),
    Comment    = require('../models/comment');

// NESTED COMMENTS ROUTES

// NEW COMMENT Form
router.get('/new', isLoggedIn, (req, res) => {
    // find campground by ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('comments/new', {campground: campground});
        }
    });

});

// CREATE COMMENT
router.post('/', isLoggedIn, (req, res) => {
    // lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // associate new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    // redirect to campground show page
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
