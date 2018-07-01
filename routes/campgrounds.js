var express    = require('express'),
    router     = express.Router(),
    Campground = require('../models/campground');

// INDEX - show all campgrounds
router.get('/', (req, res) => {
    // Get all Campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds});
        }
    });
});

// CREATE - add new campground to db
router.post('/', isLoggedIn, (req, res) => {
  // get data from form
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  var newCampground = {name: name, image: image, description: desc, author: author};
  // create new campground and save to DB (using model)
  Campground.create(newCampground, (err, newlyCreated) => {
      if (err) {
          console.log(err);
      }
      else {
          // redirect back to campgrounds page
          console.log(newlyCreated);
          res.redirect('/campgrounds');
      }
  });
});

// NEW - show form to create new campground
router.get('/new', isLoggedIn, (req, res) => res.render('campgrounds/new'));

// SHOW - shows more information about one campground
router.get('/:id', (req, res) => {
    // find campground with provided ID, populate comments from ids
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            // render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// EDIT - form to edit a camprgound
router.get('/:id/edit', checkCampgroundOwner, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE - update a specific campgrounds
router.put('/:id', checkCampgroundOwner, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            // redirect to show page
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY - delete a specific campground
router.delete('/:id', checkCampgroundOwner, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/campgrounds');
    });
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkCampgroundOwner(req, res, next) {
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

module.exports = router;