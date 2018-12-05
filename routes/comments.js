const express = require('express');
const router = express.Router();

const Comment = require('../models/comment.js');
const Post = require('../models/post.js')

router.post('/:postId', (req, res) => {
  const currentUser = req.user;
  const comment = new Comment(req.body);
  if (currentUser) {
    comment.author = currentUser._id;

    comment
      .save()
      .then((comment) =>
        Post.findById(req.params.postId)
      )
      .then((post) => {
        post.comments.unshift(comment);
        return post.save();
      })
      .then((post) => {
        res.redirect(`/posts/${req.params.postId}`);
      })
      .catch((err) => {
        console.error(err);
      })
  } else {
    return res.status(401);
  }
});

module.exports = router;
