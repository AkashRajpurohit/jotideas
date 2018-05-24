const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const crypto = require("crypto");
const router = express.Router();

const emailauth = require("../config/sendEmail");

let url = "";
if (process.env.NODE_ENV === "production") {
  url = "https://afternoon-fortress-32418.herokuapp.com";
} else {
  url = "http://localhost:5000";
}

// Load User Model
require("../models/User");
const User = mongoose.model("user");

// Login User Route
router.get("/login", (req, res) => {
	res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render("users/login");
});

// Login Form POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/ideas",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

///////////////////////////////////////////////////////////////

// Register User Route
router.get("/register", (req, res) => {
	res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
  res.render("users/register");
});

// Register Form POST
router.post("/requestActivation", (req, res) => {
  let errors = [];

  if (req.body.password !== req.body.password2) {
    errors.push({ text: "Passwords did not Matched..." });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be more than 4 Characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email is already registered");
        res.redirect("/users/register");
      } else {
        // Activation token
        const token = crypto.randomBytes(20).toString('hex');
        newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          token: token
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                emailauth.sendEmail(req.body.name, req.body.email, token, url);
                req.flash(
                  "success_msg",
                  `Check ${req.body.email} to Confirm the Account!`
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// Activate Account
router.get("/activateaccount/:token", (req, res) => {
  User.findOne({ token: req.params.token }).then(user => {
    if (!user) {
      req.flash("error_msg", "Doesn't look like a valid link");
      res.redirect("/users/register");
    } else {
      user.activated = true;
      user.token = undefined;
      user.save().then(() => {
        req.flash("success_msg", "Your account is activated Successfully!");
        res.redirect("/users/login");
      });
    }
  });
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You have Successfully Logged Out");
  res.redirect("/users/login");
});

module.exports = router;
