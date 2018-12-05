const express = require('express');
const router = express.Router();

const Post = require('../models/post')

router.get('/:subreddit', (req, res) => {
  var currentUser = req.user;
  Post.find({
      subreddit: req.params.subreddit
    })
    .then((posts) => {
      res.render('posts-index', {
        posts,
        currentUser,
      });
    });
});

module.exports = router;
