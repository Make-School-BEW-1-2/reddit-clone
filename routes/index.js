const express = require('express');
const router = express.Router();

const Post = require('../models/post.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  const currentUser = req.user;

  Post.find({})
  .populate('author')
    .then(posts => {
      res.render('posts-index', {
        posts,
        currentUser,
      });
    })
    .catch((err) => {
      console.error(err.message);
    })
});

module.exports = router;
