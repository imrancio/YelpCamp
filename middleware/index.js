// all middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please Login First!');
    res.redirect('/login');
}

middlewareObj.checkCampgroundOwner = function(req, res, next) {
    // is user logged in
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log(err);
                res.redirect('back');
            }
            else {
                // does user own campground?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                }
                // otherwise, redirect
                else {
                    res.redirect('back');
                }
            }
        });
    }
    // if not, redirect
    else {
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwner = function(req, res, next) {
    // is user logged in
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                console.log(err);
                res.redirect('back');
            }
            else {
                // does user own comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                // otherwise, redirect
                else {
                    res.redirect('back');
                }
            }
        });
    }
    // if not, redirect
    else {
        res.redirect('back');
    }
}

module.exports = middlewareObj;
