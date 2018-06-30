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
    image: String
});
// compile schema for Campground model
var Campground = mongoose.model('Campground', campgroundSchema);

// ROUTES

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  // Get all Campgrounds from DB
  Campground.find({}, (err, allCampgrounds) => {
     if (err) {
         console.log(err);
     }
     else {
         res.render('campgrounds', {campgrounds: allCampgrounds});
     }
  });
});

app.post('/campgrounds', (req, res) => {
  // get data from form
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {name: name, image: image};
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

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
})

app.listen(3000, console.log('YelpCamp server started on port 3000'));
