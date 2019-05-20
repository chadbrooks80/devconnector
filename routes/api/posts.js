const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

// Import Validators
const validatePostInput = require('../../validation/post');



// Import the Model
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

router.get('/test', (req, res) => res.json({ msg: "posts works" }));

// @route POST api/posts
// @desc Creates New Post
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req,res)=>{
  const {errors, isValid} = validatePostInput(req.body);
  
  // check validation
  if(!isValid) res.status(400).json(errors);

  // Note, with Redux it will be keeping the user's information in State
  // which is why we can access it from the req.body..
  // they are not actually typing in their name or anything
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post=>res.json(post));
  
  // find user
  User.findOne({user: req.params.id }).then(user=>{
    if(!user) res.status(404).json({error: "user not fund"});
  })
})

module.exports = router;

