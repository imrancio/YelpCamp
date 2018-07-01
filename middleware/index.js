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

module.exports = middlewareObj;
