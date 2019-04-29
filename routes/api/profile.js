const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validateProfileInput = require('../../validation/profile');
const ValidateExperienceInput = require('../../validation/experience');
const ValidateEducationInput = require('../../validation/education');

// Loads the schemas needed for getting the data of the profile.
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Tests Profile Route
router.get('/test', (req, res) => res.json({ message: 'Profile Works' }));

/*
  Grabs the user and displays profile if they have one.
  If they don't they will be prompted on the front-end to create their profile.
*/
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

/*
  MAY WANNA CHANGE TO PRIVATE, IDKKKK
  PARAMS get something from the URL
  This gets the profile by the user's handle
*/
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

/*
  This will get all the profiles in the database
*/
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noProfile = 'There are no profiles to grab.';
        return res.status(404).json(errors)
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profiles: 'There are no profiles to grab.' }));
});

/*
  MAY MAKE PRIVATE AS WELL
  This will get the users profile by their ID.
*/
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noProfile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'There is no profile' }));
});

/*
  Obtain all the fields from the request sent by user.
  Create or edit the user profile from the Schema.
  Still protected route because they need to authenticate their token.
  This is where their content will need to be validated.
*/
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  // Check Validation 
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  // Skills - This will give us an array of fields split by every comma.
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',');
  }
  // Social is an object in our schema so we have to initialize this. I hate JS sometimes.
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (profile) {
      // Update because the profile already exists
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      )
        .then(profile => res.json(profile));
    } else {
      // Create but first we need to see if handle already exists
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if (profile) {
          errors.handle = 'This handle already exists';
          res.status(400).json(errors);
        }
        new Profile(profileFields).save().then(profile => res.json(profile));
      });
    }
  });
});

/*
  Adds experience to profile.
  This will be private because only a logged in user can edit.
  This will grab the data from the form, put it in the array, and then save it to Mongo
*/
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = ValidateExperienceInput(req.body);

  if (!isValid) {
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
      }
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.json(profile));
    });
});

/*
  Adds education to profile.
  This will be private because only a logged in user can edit.
  This will grab the data from the form, put it in the array, and then save it to Mongo
*/
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = ValidateEducationInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.json(profile));
    });
});

/*
  Delete the experience on a profile
  Grabs the experience array through .map and gets its index.
  The index is then place inside of splice() so then it is removed.,
  Then saved to mongoDB and if anything is left in the array gets displayed to user.
*/
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    // Splice out of array
    profile.experience.splice(removeIndex, 1);
    profile.save().then(profile => res.json(profile));
  })
    .catch(err => res.status(404).json(err));
});

/*
  Deletes the same exact way as experience above.
*/
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

    // Splice out of array
    profile.education.splice(removeIndex, 1);
    profile.save().then(profile => res.json(profile));
  })
    .catch(err => res.status(404).json(err));
});

/*
  Deletes the user and the profile.
*/
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id }).then(() => {
    User.findOneAndRemove({ _id: req.user.id }).then(() =>
      res.json({ success: true }));
  });
});

module.exports = router;