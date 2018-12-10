const express = require('express');

const router = express.Router();

const Comment = require('../models/comment.js');
const Post = require('../models/post.js');

router.post('/:postId', (req, res) => {
  const currentUser = req.user;
  const comment = new Comment(req.body);
  if (currentUser) {
    comment.author = currentUser._id;

    Post.findById(req.params.postId)
      .then((post) => {
        post.comments.unshift(comment);
        post.save();
        return res.redirect(`/posts/${req.params.postId}`);
      })
      .catch((err) => {
        console.error(err);
        return res.status(400).send();
      });
  } else {
    return res.status(401).send();
  }
});


router.post('/:postId/:commentId/replies', (req, res) => {
  const currentUser = req.user;
  const newComment = new Comment(req.body);
  newComment.author = currentUser._id;
  Post.findById(req.params.postId)
    .then((post) => {
      const parentComment = post.comments.id(req.params.commentId);
      parentComment.comments.unshift(newComment);
      return post.save();
    }).then(post => res.redirect(`/posts/${post._id}`))
    .catch((err) => {
      console.error(err);
      return res.status(400).send();
    });
});

module.exports = router;
