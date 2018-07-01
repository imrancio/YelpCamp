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
router.post('/', (req, res) => {
  // get data from form
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  // create new campground and save to DB (using model)
  Campground.create(newCampground, (err, newlyCreated) => {
      if (err) {
          console.log(err);
      }
      else {
          // redirect back to campgrounds page
          res.redirect('/campgrounds');
      }
  });
});

// NEW - show form to create new campground
router.get('/new', (req, res) => res.render('campgrounds/new'));

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

module.exports = router;
