const express = require('express');
const app = express();
const mongoose = require('mongoose');

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

app.get('/', (req, res) => res.send('Displaying Content Successful'));

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Notifies which port developer is working on.
app.listen(port, () => console.log(`Server listening on port ${port}`));

// const conn = mongoose.createConnection(`mongodb://${server}/${database}`, { useNewUrlParser: true });


// // Structure of the document
// const registerSchema = new mongoose.Schema({
//   username: String,
//   firstName: String,
//   lastName: String,
//   email: String,
//   password: String
// });

// // Creates a folder which will store the User data.
// const User = mongoose.model('User', registerSchema);

// // Saves the users info from the register from in App.js
// app.post('/register', (req, res) => {
//   const { username, firstName, lastName, email, password } = req.body;
//   let data = new User(req.body);
//   data.save().then(item => {
//     console.log(item);
//     res.send('Data was saved to database!');
//   })
//     .catch(err => {
//       res.status(400).send(`Unable to save to database ${err}`);
//     });
// });

// // Checks the users data with stored data and either enters or rejects user.S
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   User.findOne({ username: username, password: password }, (err, user) => {
//     if (!user) {
//       res.status(404).send(`The user you entered does not exists: ${user}`);
//     }
//     res.status(200).send(`Logged into KnowMe. Enjoy!`);
//   })
//     .catch(err => {
//       res.status(400).send(`Unable to save to database ${err}`);
//     })
// });

