const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const keys = require('../../config/keys');
const passport = require('passport');

// Get the input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Tests User Route
router.get('/test', (req, res) => res.json({ message: 'Users Works' }));

// Registers a user and connects to the database
// Runs the validation method checking all inputs are acceptable.
// Attempt to find if the email already exists
// Also creates avatar, encrypts password, and stores in DB.
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Validates if the body has any empty info.
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        // Found a cool thing called gravatar. Neat
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });

        // Creates a user from the request.
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        // Encrypts the password before it is entered into the database. 
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            // Saves it to the database.
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
});

// Returns the JWT Token
// Test the email and password being different to make it fail in PostMan
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Validates if the body has any empty info.
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }

      // Compare the hashed and non-hashed password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // Creates the payload that will then go into the token
            const payload = { id: user.id, name: user.name, avatar: user.avatar }

            // Give the payload to the token and callback
            // Use Bearer Protocol
            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            });
          } else {
            errors.password = 'Password incorrect';
            return res.status(400).json(errors);
          }
        })
    });
});

// Returns the current user if the token is valid and authenticated by passport.
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;