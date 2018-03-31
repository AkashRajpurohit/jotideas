const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const csrf = require('csurf');

// CSRUF Middleware
const csrfProtection = csrf()

router.use(csrfProtection)

// Load User Model
require('../models/User');
const User = mongoose.model('user')

// Login User Route
router.get('/login',(req,res) => {
  res.render('users/login', {csrfToken : req.csrfToken()});
});

// Login Form POST
router.post('/login',(req,res,next) => {
  passport.authenticate('local',{
    successRedirect : '/ideas',
    failureRedirect : '/users/login',
    failureFlash : true
  })(req,res,next);
})

///////////////////////////////////////////////////////////////

// Register User Route
router.get('/register',(req,res) => {
  res.render('users/register',{csrfToken : req.csrfToken()});
});

// Register Form POST
router.post('/register',(req,res) => {
  let errors = [];

  if(req.body.password !== req.body.password2) {
    errors.push({ text : 'Passwords did not Matched...' });
  }

  if(req.body.password.length < 6) {
    errors.push({ text : 'Password must be more than 6 Characters' });
  }

  if(errors.length > 0) {
    res.render('users/register',{
      errors : errors,
      name : req.body.name,
      email : req.body.email,
    });
  } else {
    User.findOne({ email : req.body.email })
      .then(user => {
        if(user){
          req.flash('error_msg','Email is already registered')
          res.redirect('/users/register')
        } else {
          newUser = new User({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
          });
          bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(newUser.password,salt, (err,hash) => {
              newUser.password = hash;
      
              newUser.save()
                .then(user => {
                  req.flash('success_msg','You are now Registered and can Login now');
                  res.redirect('/users/login');
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

// Logout Route
router.get('/logout',(req,res) => {
  req.logout();
  req.flash('success_msg','You have Successfully Logged Out');
  res.redirect('/users/login');
});

module.exports = router;