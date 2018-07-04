var express      = require('express'),
    router       = express.Router(),
    Campground   = require('../models/campground'),
    middleware   = require('../middleware'),
    NodeGeocoder = require('node-geocoder'),
    multer       = require('multer'),
    cloudinary   = require('cloudinary');

// Google Maps API config
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
var geocoder = NodeGeocoder(options);

// Multer/Cloudinary file upload config
var storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = (req, file, callback) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// INDEX - show all campgrounds
router.get('/', (req, res) => {
    if (req.query.search) {
       // Search Campground searchable fields and run query
       Campground.search(req.query.search.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''), (err, foundCampgrounds) => {
           if (err || !foundCampgrounds.length) {
               console.log(err);
               req.flash('error', 'No campground found matching that criteria');
               return res.redirect('back');
           }
           res.render('campgrounds/', {campgrounds: foundCampgrounds, page: 'campgrounds'});
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
router.post('/', middleware.isLoggedIn, upload.single('image'), middleware.updateTime, (req, res) => {
    // get data from form
    var newCampground = req.body.campground;
    newCampground.author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(newCampground.location, (err, data) => {
        if (err || !data.length) {
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        newCampground.lat = data[0].latitude;
        newCampground.lng = data[0].longitude;
        newCampground.location = data[0].formattedAddress;

        // file has been uploaded
        if (req.file) {
            // upload image to cloudinary
            cloudinary.uploader.upload(req.file.path, (result) => {
                // add cloudinary url for image
                newCampground.image = result.secure_url;
                newCampground.imageId = result.public_id;
                // create new campground and save to DB (using model)
                Campground.create(newCampground, (err, newlyCreated) => {
                    if (err) {
                        console.log(err);
                        req.flash('error', err.message);
                        return res.redirect
                    }
                    req.flash('success', 'Created ' + newlyCreated.name);
                    // redirect back to campgrounds page
                    res.redirect('/campgrounds/' + newlyCreated._id);
                });
            });
        }
        // no image file, use url
        else {
            // create new campground and save to DB (using model)
            Campground.create(newCampground, (err, newlyCreated) => {
                if (err) {
                    console.log(err);
                    req.flash('error', err.message);
                    return res.redirect
                }
                req.flash('success', 'Created ' + newlyCreated.name);
                // redirect back to campgrounds page
                res.redirect('/campgrounds/' + newlyCreated._id);
            });
        }
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
        } else {
            // render show template with that campground
            res.render('campgrounds/show', {
                campground: foundCampground
            });
        }
    });
});

// EDIT - form to edit a camprgound
router.get('/:id/edit', middleware.checkCampgroundOwner, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render('campgrounds/edit', {
            campground: foundCampground
        });
    });
});

// UPDATE - update a specific campgrounds
router.put('/:id', middleware.checkCampgroundOwner, upload.single('image'), middleware.updateTime, (req, res) => {
    // find and update the correct campground
    Campground.findById(req.params.id, async (err, campground) => {
        if (err) {
            console.log(err);
            return res.redirect('/campgrounds');
        }
        // update from form data
        campground.name = req.body.campground.name;
        campground.price = req.body.campground.price;
        campground.description = req.body.campground.description;
        // update time from middleware
        campground.createdAt = req.body.campground.createdAt;
        // file upload
        // TODO: check if same image uploaded
        if (req.file) {
            try {
                // delete cloudinary image (if exists)
                if (campground.imageId) {
                    await cloudinary.uploader.destroy(campground.imageId);
                }
                let result = await cloudinary.uploader.upload(req.file.path);
                campground.imageId = result.public_id;
                campground.image = result.secure_url;
            } catch (err) {
                console.log(err);
                req.flash('error', err.message);
                return res.redirect('back');
            }
        }
        // image url
        else if (req.body.campground.image) {
            // delete cloudinary image (if exists)
            if (campground.imageId) {
                try {
                    await cloudinary.uploader.destroy(campground.imageId);
                    campground.imageId = null;
                } catch(err) {
                    console.log(err);
                    req.flash('error', err.message);
                    res.redirect('back');
                }
            }
            // update image url
            campground.image = req.body.campground.image;
        }
        // update maps api location (if changed)
        if (req.body.campground.location !== campground.location) {
            try {
                let data = await geocoder.geocode(req.body.campground.location);
                campground.lat = data[0].latitude;
                campground.lng = data[0].longitude;
                campground.location = data[0].formattedAddress;
            } catch (err) {
                console.log(err);
                req.flash('error', 'Invalid address');
                return res.redirect('back');
            }
        }
        // save updates to campground
        campground.createdAt = req.body.campground.createdAt;
        campground.save();
        // redirect to show page
        req.flash('success', 'Updated ' + campground.name);
        res.redirect('/campgrounds/' + req.params.id);
    });
});

// DESTROY - delete a specific campground
router.delete('/:id', middleware.checkCampgroundOwner, (req, res) => {
    Campground.findById(req.params.id, async (err, campground) => {
        if (err) {
            console.log(err);
            req.flash('error', err.message);
            return res.redirect('back');
        }
        // delete cloudinary image
        if (campground.imageId) {
            try {
                await cloudinary.uploader.destroy(campground.imageId);
            } catch (err) {
                console.log(err);
                req.flash('error', err.message);
                return res.redirect('back');
            }
        }
        campground.remove();
        req.flash('success', 'Deleted ' + campground.name);
        res.redirect('/campgrounds');
    });
});

module.exports = router;
