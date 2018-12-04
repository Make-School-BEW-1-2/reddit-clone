const express = require('express');
const router = express.Router();

const Post = require('../models/post.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find({})
  .then(posts => {
    res.render('posts-index', { posts });
  })
  .catch((err) => {
    console.error(err.message);
  })
});

module.exports = router;
