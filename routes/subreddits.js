const express = require('express');
const router = express.Router();

const Post = require('../models/post')

router.get('/:subreddit', (req, res) => {
  Post.find({ subreddit: req.params.subreddit})
  .then((posts) => {
    res.render('posts-index', { posts });
  });
});

module.exports = router;
