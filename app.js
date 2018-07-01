var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment'),
    seedDB      = require('./seeds');

// Connect or create MongoDB through mongoose
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// set up seed database
// seedDB();

// RESTful Routes

app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX - show all campgrounds
app.get('/campgrounds', (req, res) => {
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
app.post('/campgrounds', (req, res) => {
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
app.get('/campgrounds/new', (req, res) => res.render('campgrounds/new'));

// SHOW - shows more information about one campground
app.get('/campgrounds/:id', (req, res) => {
    // find campground with provided ID, populate comments from ids
    Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(foundCampground);
            // render show template with that campground
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

// NESTED COMMENTS ROUTES

// NEW COMMENT Form
app.get('/campgrounds/:id/comments/new', (req, res) => {
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
app.post('/campgrounds/:id/comments', (req, res) => {
    // lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    // associate new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to campground show page
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});


app.listen(3000, console.log('YelpCamp server started on port 3000'));
