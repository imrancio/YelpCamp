var express      = require('express'),
    router       = express.Router(),
    Campground   = require('../models/campground'),
    middleware   = require('../middleware'),
    NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

// INDEX - show all campgrounds
router.get('/', (req, res) => {
    if (req.query.search) {
       // Search Campground searchable fields and run query
       Campground.search(req.query.search.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''), (err, foundCampgrounds) => {
           if (err) {
               console.log(err);
               // res.redirect('/campgrounds');
           }
           else {
               if (!foundCampgrounds.length) {
                   req.flash('error', 'No campground found matching that criteria');
                   res.redirect('back');
               }
               res.render('campgrounds/', {campgrounds: foundCampgrounds, page: 'campgrounds'});
           }
       });
    }
    else {
        // Get all Campgrounds from DB
        Campground.find({}, (err, allCampgrounds) => {
            if (err) {
                console.log(err);
                // res.redirect('/campgrounds');
            }
            else {
                res.render('campgrounds/index', {campgrounds: allCampgrounds, page: 'campgrounds'});
            }
        });
    }
});

// CREATE - add new campground to db
router.post('/', middleware.isLoggedIn, (req, res) => {
  // get data from form
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  geocoder.geocode(req.body.location, (err, data) => {
     if (err || !data.length) {
         console.log(err);
         req.flash('error', 'Invalid address');
         return res.redirect('back');
     }
     var lat = data[0].latitude;
     var lng = data[0].longitude;
     var location = data[0].formattedAddress;
     var newCampground = {
         name: name, price: price,
         image: image,
         description: desc,
         author: author,
         location: location,
         lat: lat,
         lng: lng
     };
     // create new campground and save to DB (using model)
     Campground.create(newCampground, (err, newlyCreated) => {
         if (err) {
             console.log(err);
         }
         else {
             req.flash('success', 'Created ' + newlyCreated.name);
             // redirect back to campgrounds page
             res.redirect('/campgrounds');
         }
     });
  });
});

// NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => res.render('campgrounds/new'));

// SHOW - shows more information about one campground
router.get('/:id', (req, res) => {
    // find campground with provided ID, populate comments from ids
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err || !foundCampground) {
            console.log(err);
            req.flash('error', 'Campground not found');
            return res.redirect('/campgrounds');
        }
        else {
            // render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// EDIT - form to edit a camprgound
router.get('/:id/edit', middleware.checkCampgroundOwner, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE - update a specific campgrounds
router.put('/:id', middleware.checkCampgroundOwner, (req, res) => {
    geocoder.geocode(req.body.campground.location, (err, data) => {
        if (err || !data.length) {
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        // find and update the correct campground
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
            if (err) {
                console.log(err);
                res.redirect('/campgrounds');
            }
            else {
                // redirect to show page
                req.flash('success', 'Updated ' + req.body.campground.name);
                res.redirect('/campgrounds/' + req.params.id);
            }
        });
    });
});

// DESTROY - delete a specific campground
router.delete('/:id', middleware.checkCampgroundOwner, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, removed) => {
        if (err) {
            console.log(err);
        }
        req.flash('success', 'Deleted ' + removed.name);
        res.redirect('/campgrounds');
    });
});

module.exports = router;
