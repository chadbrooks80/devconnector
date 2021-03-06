const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load profile Model
const Profile = require('../../models/Profile');

//  load user profile
const User = require('../../models/User');

// @route GET api/profile
// @desc Tests profile route
// @access Public
router.get('/test', (req, res) => res.json({ msg: "profile works" }));



// @route GET api/profile
// @desc gets current user's profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar']) //this gets the name and avatr from the users table.
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no profile for this user'
        return res.status(404).json({ errors })
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err))
});

// @route GET api/profile/all
// @desc Get all Profiles
// @access Public
router.get('/all', (req, res) => {
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noProfile = 'There are no profiles'
        res.status(404).json(errors)
      }
      res.json(profiles);
    })
    .catch(err => {
      res.status(404).json({ profile: "There are no profiles" })
    })
})


// @route GET api/profile/handle/:handle
// @desc Get Profile By Handle
// @access Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle }) //this gets the handle up above :handle in the url
    .populate('user', ['name', 'avatar']) //this gets the name and avatr from the users table.
    .then(profile => {
      if (!profile) {
        errors.noProfile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err));
});

// @route GET api/profile/user/:user_id
// @desc Get Profile By user ID
// @access Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  console.log("userId:  " + req.params.user_id);
  Profile.findOne({ _id: req.params.user_id }) //this gets the handle up above :handle in the url
    .populate('user', ['name', 'avatar']) //this gets the name and avatr from the users table.
    .then(profile => {
      if (!profile) {
        errors.noProfile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile for this user' }));
});


// @route GET api/profile/user/:user_id
// @desc Get Profile By user ID
// @access Public


// @route POST api/profile
// @desc Create or Edit User profile
// @access Private
router.post('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    const { errors, isValid } = validateProfileInput(req.body);

    // chekc validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills - Split into an Array
    if (typeof req.body.skills !== undefined) {
      profileFields.skills = req.body.skills.split(",");
    }

    // SOCIAL
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          // Update
          Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
            .then(profile => res.json(profile));
        } else {
          // Create

          // Check if handle exists
          Profile.findOne({ handle: profileFields.handle }).then(profile => {
            if (profile) {
              errors.handle = "That handle already exists";
              res.status(400).json(errors);
            }

            // Save Profile
            new Profile(profileFields).save().then(profile => res.json(profile)).catch(err => console.log(err));
          });
        }
      })
  }

);

// @route POST api/profile/experience
// @desc Add experience to profile
// @access Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validateExperienceInput(req.body);

  // chekc validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // add to experience array
      //unshift puts it at the begiining (unlike push) we want the newest expeience at the front
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));

    });
});

// @route POST api/profile/education
// @desc Add education to profile
// @access Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validateEducationInput(req.body);



  // chekc validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldOfStudy: req.body.fieldOfStudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // add to experience array
      //unshift puts it at the begiining (unlike push) we want the newest expeience at the front
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));

    });
});

// @route Delete api/profile/experience/:exp_id
// @desc Delete experience form profile private route
// @access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({ user: req.user.id }).then(profile => {
    // Get remove index
    const removeIndex = profile.experience
      .map(item=>item.id)
      .indexOf(req.params.exp_id);

    // splice out of array
    profile.experience.splice(removeIndex, 1);

    // Save 
    profile.save().then(profile=> {
      res.json(profile);
    })
    .catch(err=>res.status(404).json(err));
  });
});

// @route Delete api/profile/education/:exp_id
// @desc Delete education form profile private route
// @access Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  Profile.findOne({ user: req.user.id }).then(profile => {
    // Get remove index
    const removeIndex = profile.education
      .map(item=>item.id)
      .indexOf(req.params.edu_id);
    console.log("removeIndex: " + removeIndex)
    // splice out of array
    profile.education.splice(removeIndex, 1);

    // Save 
    profile.save().then(profile=> {
      res.json(profile);
    })
    .catch(err=>res.status(404).json(err));
  });
});

// @route Delete api/profile
// @desc Delete user and profile
// @access Private
router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  console.log(req.user.id);
  Profile.findOneAndDelete({user: req.user.id})
    .then(profile=>{
      User.findOneAndRemove({_id: req.user.id}).then(User=>{
        res.json({success: true})
      })
    })
});



module.exports = router;

