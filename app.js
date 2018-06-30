var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

// Connect or create MongoDB through mongoose
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

// SCHEMA SETUP
// create schema for campground
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
// compile schema for Campground model
var Campground = mongoose.model('Campground', campgroundSchema);

// TEMPORARY ADD TO DB
// Campground.create(
//     {
//         name: 'Aeternum Night',
//         image: 'https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104496f0c370afeab5b8_340.jpg',
//         description: 'Enjoy a relaxing night under beautiful purple aurora radiating through the skies.'
//     }, (err, campground) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log('New Campground added:');
//             console.log(campground);
//         }
//     }
// );

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
         res.render('index', {campgrounds: allCampgrounds});
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
app.get('/campgrounds/new', (req, res) => {
  res.render('new');
})

// SHOW - shows more information about one campground
app.get('/campgrounds/:id', (req, res) => {
    // find campground with provided ID
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            // render show template with that campground
            res.render('show', {campground: foundCampground});
        }
    });
});

app.listen(3000, console.log('YelpCamp server started on port 3000'));
