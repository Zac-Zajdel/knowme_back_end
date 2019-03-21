const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Will Do Later arent exactly sure of how we want to set this up completely.
const PostsSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    require: true
  }
});

module.exports = Posts = mongoose.model('posts', PostsSchema);