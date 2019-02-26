const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = '127.0.0.1:27017';
const database = 'KnowMe';
const port = 3000;


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


// Structure of the document
const registerSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String
});

// Creates a folder which will store the User data.
const User = mongoose.model('User', registerSchema);

app.post('/register', (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;
  let data = new User(req.body);
  data.save().then(item => {
    console.log(item);
    res.send('Data was saved to database!');
  })
    .catch(err => {
      res.status(400).send(`Unable to save to database ${err}`);
    });
});

app.get('/', (req, res) => {
  res.send('Displaying Content Successful');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})