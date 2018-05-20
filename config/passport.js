const LocalStratergy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load User Model
const User = mongoose.model("user");

module.exports = function(passport) {
  passport.use(
    new LocalStratergy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: "No User Found, Try Again" });
        }

        if (!user.activated) {
          return done(null, false, {
            message: `Oops! Looks Like you haven't activated the account yet.Check your email ${
              user.email
            } to activate it`
          });
        }

        // Match Password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password Incorrect" });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
