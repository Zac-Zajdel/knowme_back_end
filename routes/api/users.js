const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const keys = require('../../config/keys');
const passport = require('passport');

// Tests User Route
router.get('/test', (req, res) => res.json({ message: 'Users Works' }));

// Registers a user and connects to the database
// Attempt to find if the email already exists
// Also creates avatar, encrypts password, and stores in DB.
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists in the database' });
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
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ email: 'The User was not found' });
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
            return res.status(400).json({ password: 'Password incorrect' });
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