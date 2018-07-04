var express    = require('express'),
    router     = express.Router({mergeParams: true}),
    middleware = require('../middleware'),
    Campground = require('../models/campground'),
    Comment    = require('../models/comment');

// NESTED COMMENTS ROUTES

// NEW COMMENT Form
router.get('/new', middleware.ensureLoggedIn('/login'), (req, res) => {
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
router.post('/', middleware.ensureLoggedIn('/login'), middleware.updateTime, (req, res) => {
    // lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Something went wrong');
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
                    // redirect to campground show page
                    req.flash('success', 'Added comment');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// EDIT - edit a specific comment
router.get('/:comment_id/edit', middleware.checkCommentOwner, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) =>{
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE - update a specific comment
router.put('/:comment_id', middleware.checkCommentOwner, middleware.updateTime, (req, res) => {

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            req.flash('success', 'Updated comment');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY - delete a comment
router.delete('/:comment_id', middleware.checkCommentOwner, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            console.log(err);
            res.redirect('back');
        }
        else {
            req.flash('success', 'Deleted comment');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;
