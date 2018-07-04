var User       = require('../models/user'),
    Comment    = require('../models/comment'),
    Campground = require('../models/campground');

// all middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
}

middlewareObj.checkCampgroundOwner = function(req, res, next) {
    // is user logged in
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err || !foundCampground) {
                console.log(err);
                req.flash('error', 'Campground not found');
                res.redirect('back');
            }
            else {
                // does user own campground?
                if (req.user.isAdmin || foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                // otherwise, redirect
                else {
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            }
        });
    }
    // if not, redirect
    else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwner = function(req, res, next) {
    // is user logged in
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err || !foundComment) {
                console.log(err);
                req.flash('error', 'Comment not found');
                res.redirect('back');
            }
            else {
                // does user own comment?
                if (req.user.isAdmin || foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                // otherwise, redirect
                else {
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            }
        });
    }
    // if not, redirect
    else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middlewareObj.checkUser = function(req, res, next) {
    // is user logged in
    if(req.isAuthenticated()) {
        User.findById(req.params.id, (err, foundUser) => {
            if (err || !foundUser) {
                console.log(err);
                req.flash('error', 'User not found');
                res.redirect('back');
            }
            else {
                // does user own profile?
                if (req.user.isAdmin || foundUser._id.equals(req.user._id)) {
                    next();
                }
                // otherwise, redirect
                else {
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            }
        });
    }
    // if not, redirect
    else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
}

middlewareObj.checkAvatar = function(req, res, next) {
    if (req.body.avatar != null) {
        req.body.avatar = req.body.avatar ? req.body.avatar : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    }
    else if (req.body.user != null) {
        req.body.user.avatar = req.body.user.avatar ? req.body.user.avatar : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    }
    next();
}

middlewareObj.updateTime = function(req, res, next) {
    if (req.body.comment != null) {
        req.body.comment.createdAt = Date.now();
    }
    else if (req.body.campground != null) {
        req.body.campground.createdAt = Date.now();
    }
    next();
}

module.exports = middlewareObj;
