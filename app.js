// prod / dev environment variables
process.env.NODE_ENV === "production" || require("dotenv").config();

var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  User = require("./models/user");

// requiring routes
var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  userRoutes = require("./routes/users"),
  indexRoutes = require("./routes/index");

// Connect or create MongoDB through mongoose
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost/yelp_camp");
// use body-parser to get form data from req.body
app.use(bodyParser.urlencoded({ extended: true }));
// set view engine
app.set("view engine", "ejs");
// serve public directory
app.use(express.static(__dirname + "/public"));
// method-override for PUT and DELETE requests
app.use(methodOverride("_method"));
// connect-flash messages
app.use(flash());
// momentJS for time
app.locals.moment = require("moment");

// PASSPORT CONFIG
app.use(
  require("express-session")({
    secret: "This is some secret for encryption",
    resave: false,
    saveUninitialized: false
  })
);

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
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  // next from middleware
  next();
});

// RESTful Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
// require router with mergeParams true to get id param in the request
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/users/:id", userRoutes);

app.listen(process.env.PORT, process.env.IP, () =>
  console.log("YelpCamp server started on port " + process.env.PORT)
);
