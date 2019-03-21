const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// Passport Middleware
app.use(passport.initialize());

// Middleware that allows us to connect to the req.body of a given request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Aquire each route depending on the 
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// Database Information
const server = '127.0.0.1:27017';
const database = 'KnowMe';
const port = process.env.PORT || 3000;
const db = require('./config/keys').mongoConnection;

// Testing Connection to mongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Passport Configuration
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Notifies which port developer is working on.
app.listen(port, () => console.log(`Server listening on port ${port}`));

