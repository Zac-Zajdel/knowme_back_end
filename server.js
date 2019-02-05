const mongoose = require('mongoose');

const server = '127.0.0.1:27017';
const database = 'KnowMe';

// Check if we have a successful connection with the database.
connection = () => {
  mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true })
    .then(() => {
      console.log('connection successful');
    })
    .catch((err) => {
      console.log(err);
    })
}

connection();

// Structure of the database.
const emailSchema = new mongoose.Schema({
  email: String
});

// A model is a class with which we construct documents.
let email = mongoose.model('email', emailSchema);

// Creates a new document
// This will be the users in KnowMe
let email_address = new email({ email: 'zaczajdel213@gmail.com' });
console.log(email_address.email);

email_address.save((err) => {
  if (err) {
    console.log(err);
  }
  console.log('Saved to database');
});