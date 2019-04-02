const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const ValidatePostInput = require('../../validation/post');

// Tests post route
router.get('/test', (req, res) => res.json({ message: 'Posts Works' }));

/*
  This route will allow the user to create a post.
  The access will be private.
*/
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = ValidatePostInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post => res.json(post));
});

/*
  This will grab all of the posts.
  This is a public route because we don't care if someone sees posts.
*/
router.get('/', (req, res) => {
  Post.find().sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPosts: 'No posts found.' }));
});

//This will grab a single post
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ noPost: 'There is no post with that id' }));
});

/*
  This is private because we only want the user to be able to delete their post.
  We check by comparing the users id and the posts id.
  If satisfied, we then delete the post.
*/
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id).then(post => {
      // check to see if the owner is the one deleting
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ notunauthorized: 'Not authorized' });
      }
      post.remove().then(() => res.json({ success: true }));
    })
      .catch(err => res.status(404).json({ noPost: 'No Post found' }));
  });
});

/*
  This route will let the user like a post.
  First we check if the user has already liked a post because they can't do it twice.
  If that passes we take the id to the likes array and save to database.
*/
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id }).then(profile => {
    Post.findById(req.params.id).then(post => {
      if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({ alreadyLiked: 'User already liked this post' });
      }
      post.likes.unshift({ user: req.user.id });

      post.save().then(post => res.json(post));
    })
      .catch(err => res.status(404).json({ noPost: 'No Post found' }));
  });
});

module.exports = router;