var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user"),
  async = require("async"),
  nodemailer = require("nodemailer"),
  crypto = require("crypto"),
  middleware = require("../middleware");

// ROOT ROUTE
router.get("/", (req, res) => {
  res.render("landing");
});

// AUTH ROUTES

// show register form
router.get("/register", (req, res) =>
  res.render("register", { page: "register" })
);

// handle sign up logic
router.post("/register", middleware.checkAvatar, (req, res) => {
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar
  });
  if (req.body.adminCode === process.env.ADMINPW) {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      if (err.message.startsWith("E11000")) {
        req.flash("error", "A user with the given email is already registered");
      } else {
        req.flash("error", err.message);
      }
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

// LOGIN ROUTES

// show login form
router.get("/login", (req, res) => res.render("login", { page: "login" }));

// handle login logic
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    var returnTo = req.session.returnTo;
    delete req.session.returnTo;
    // flash welcome message
    if (!returnTo) {
      req.flash(
        "success",
        "Welcome back " +
          req.user.firstName +
          (req.user.lastName ? " " + req.user.lastName : "") +
          "!"
      );
    }
    // redirect back to original url or campgrounds index
    res.redirect(returnTo || "/campgrounds");
  }
);

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/campgrounds");
});

// forgot password form
router.get("/forgot", (req, res) => res.render("forgot"));

router.post("/forgot", (req, res, next) => {
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, (err, buff) => {
          // token will be sent to user's email
          var token = buff.toString("hex");
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (err || !user) {
            req.flash("error", "No account with that email exists");
            return res.redirect("/forgot");
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 36000000; // 1 hr

          user.save(err => done(err, token, user));
        });
      },
      // sends the email
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAILPW
          }
        });

        var mailOptions = {
          to: user.email,
          from: process.env.GMAIL,
          subject: "YelpCamp Password Reset",
          text:
            "You are receiving this because (maybe) you have requested the rest of the password to your YelpCamp account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "This link will expire in 60 mins.\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged."
        };
        smtpTransport.sendMail(mailOptions, (err, resp) => {
          if (err) {
            console.log(err);
          }
          console.log("mail sent");
          req.flash(
            "success",
            "An e-mail has been sent to " +
              user.email +
              " with further instructions"
          );
          done(err, "done");
        });
      }
    ],
    err => {
      if (err) return next(err);
      res.redirect("/forgot");
    }
  );
});

// handle reset form
router.get("/reset/:token", (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    (err, user) => {
      if (err || !user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot");
      }
      res.render("reset", { token: req.params.token });
    }
  );
});

// handle reset password
router.post("/reset/:token", function(req, res) {
  async.waterfall(
    [
      function(done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function(err, user) {
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("back");
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function(err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                  req.logIn(user, function(err) {
                    done(err, user);
                  });
                });
              });
            } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect("back");
            }
          }
        );
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: process.env.GMAIL,
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash("success", "Success! Your password has been changed.");
          done(err);
        });
      }
    ],
    function(err) {
      res.redirect("/campgrounds");
    }
  );
});

module.exports = router;
