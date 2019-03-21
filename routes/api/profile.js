const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Loads the schemas needed for getting the data of the profile.
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Tests Profile Route
router.get('/test', (req, res) => res.json({ message: 'Profile Works' }));



module.exports = router;