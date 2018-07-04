var User       = require('../models/user'),
    Comment    = require('../models/comment'),
    Campground = require('../models/campground');

// all middleware goes here
var middlewareObj = {};

// checks if user logged in
middlewareObj.ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// checks if current user owns campground
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
// checks if current user owns comment
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
// checks if current user owns profile
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
// sets default avatar if not set
middlewareObj.checkAvatar = function(req, res, next) {
    defaultAvatar = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    if (req.body.avatar != null) {
        req.body.avatar = req.body.avatar ? req.body.avatar : defaultAvatar;
    }
    else if (req.body.user != null) {
        req.body.user.avatar = req.body.user.avatar ? req.body.user.avatar : defaultAvatar;
    }
    next();
}
// updates createdAt time for comments/campgrounds
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
