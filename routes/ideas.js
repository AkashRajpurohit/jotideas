const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Model Idea
require('../models/Idea');
const Idea = mongoose.model('ideas');


// Add Ideas Route
router.get('/add', ensureAuthenticated, (req,res) => {
  res.render('ideas/add');
});

// Edit Ideas Route
router.get('/edit/:id',ensureAuthenticated, (req,res) => {
  Idea.findOne({
    _id : req.params.id
  })
  .then(idea => {
    if(idea.user != req.user.id) {
      req.flash('error_msg','Not Authorized')
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit',{
        idea : idea
      });
    }
  });
});

// Route of Index in Idea
router.get('/',ensureAuthenticated, (req,res) => {
  Idea.find({user : req.user.id})
    .sort({date : "desc"})
    .then(ideas => {
      res.render('ideas/index',{
        ideas : ideas
      });
    });
});

// Process Form
router.post('/', ensureAuthenticated, (req,res) => {
  let errors = [];

  if(!req.body.title) {
    errors.push({ text : "Please Enter a Title.." });
  }
  if(!req.body.details) {
    errors.push({ text : "Please Enter some Details" });
  }

  if(errors.length > 0) {
    res.render('ideas/add',{
      errors : errors,
      title : req.body.title,
      details : req.body.details
    });
  } else {
    newUser = {
      title : req.body.title,
      details : req.body.details,
      user : req.user.id
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg','Video idea added')
        res.redirect('/ideas')})
      .catch(err => {
        console.log(err);
        req.flash('error_msg','Sorry but some error occurred')
      })
  }
});

router.put('/:id', ensureAuthenticated, (req,res) => {
  Idea.findOne({
    _id : req.params.id
  })
  .then(idea => {
    //new Values

    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea => {
      req.flash('success_msg','Video idea updated')
      res.redirect('/ideas');
    })
    .catch(err => {
      console.log(err);
      req.flash('error_msg','Sorry but some error occurred')
    })
  });
});

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req,res) => {
  Idea.remove({ _id : req.params.id })
    .then(() => {
      req.flash('success_msg','Video idea is removed')
      res.redirect('/ideas')
    })
    .catch(err => {
      console.log(err);
      req.flash('error_msg','Sorry but some error occurred')
    })
});


module.exports = router;