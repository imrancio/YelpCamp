var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    User          = require('./models/user'),
    seedDB        = require('./seeds');
// requiring routes
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');

// Connect or create MongoDB through mongoose
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// set up seed database
// seedDB();

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'This is some secret for encryption',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// custom middleware
app.use((req, res, next) => {
    // make currentUser available in all templates
    res.locals.currentUser = req.user;
    // next from middleware
    next();
});

// RESTful Routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
// require router with mergeParams true to get id param in the request
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, console.log('YelpCamp server started on port 3000'));
