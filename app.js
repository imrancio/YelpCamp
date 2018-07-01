var express        = require('express'),
    app            = express(),
    bodyParser     = require('body-parser'),
    flash          = require('connect-flash'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local'),
    methodOverride = require('method-override'),
    Campground     = require('./models/campground'),
    Comment        = require('./models/comment'),
    User           = require('./models/user'),
    seedDB         = require('./seeds');
// requiring routes
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');

// Connect or create MongoDB through mongoose
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); // seed the database

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

// adding locals
app.use((req, res, next) => {
    // make currentUser available in all templates
    res.locals.currentUser = req.user;
    // make flash messages available in all templates
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    // next from middleware
    next();
});

// RESTful Routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
// require router with mergeParams true to get id param in the request
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, console.log('YelpCamp server started on port 3000'));
