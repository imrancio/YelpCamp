var User               = require('../models/user'),
    Comment            = require('../models/comment'),
    Campground         = require('../models/campground'),
    connectEnsureLogin = require('connect-ensure-login');

// all middleware goes here
var middleware = {};

// checks if user logged in; redirects back to previous page
middleware.ensureLoggedIn = connectEnsureLogin.ensureLoggedIn;

// checks if current user owns campground
middleware.checkCampgroundOwner = function(req, res, next) {
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
middleware.checkCommentOwner = function(req, res, next) {
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
middleware.checkUser = function(req, res, next) {
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
middleware.checkAvatar = function(req, res, next) {
    defaultAvatar = 'http://' + req.headers.host + '/images/blank-profile-picture.png';
    if (req.body.avatar != null) {
        req.body.avatar = req.body.avatar ? req.body.avatar : defaultAvatar;
    }
    else if (req.body.user != null) {
        req.body.user.avatar = req.body.user.avatar ? req.body.user.avatar : defaultAvatar;
    }
    next();
}
// updates createdAt time for comments/campgrounds
middleware.updateTime = function(req, res, next) {
    if (req.body.comment != null) {
        req.body.comment.createdAt = Date.now();
    }
    else if (req.body.campground != null) {
        req.body.campground.createdAt = Date.now();
    }
    next();
}

module.exports = middleware;
