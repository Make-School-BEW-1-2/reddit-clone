const express = require('express');
const router = express.Router();

const Post = require('../models/post.js')
const User = require('../models/user.js')

router.get('/new', (req, res) => {
  res.render('posts-new');
});

router.post('/new', (req, res) => {
  const currentUser = req.user;
  if (currentUser) {
    const newPost = Post(req.body);
    newPost.author = currentUser;
    newPost.save()
      .then((err, post) => User.findById(currentUser._id))
      .then((user) => {
        user.posts.unshift(newPost);
        user.save();
        return res.redirect(`/posts/${newPost._id}`);
      })
      .catch((err) => {
        console.error(err);
        return res.status(400).send();
      })
  } else {
    return res.status(401).send();
  }
})

router.get('/:id', (req, res) => {
  const currentUser = req.user;
  Post.findById(req.params.id)
    .populate('author')
    .then((post) => {
      console.log(post.comments);
      res.render('post-show', {
        post,
        currentUser,
      });
    })
    .catch((err) => {
      console.error(err);
    })
})

module.exports = router;
