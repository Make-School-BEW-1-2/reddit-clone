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

function findParentComment(newComment, comments, parentId) {
  // iterate through all of the comments
  for (let i = 0; i < comments.length; i += 1) {
    console.log('LOOKING AT', comments[i].content, 'SUBCOM', comments[i].comments);
    // if this comment's id matches the parent
    if (comments[i]._id == parentId) {
      console.log('FOUND');
      // add the new comment to its subcomments
      comments[i].comments.unshift(newComment);
      // say we found it
      return true;
    }
    // elseif the comment has subcomments run findParentComment on all of the subcomments
    if (comments[i].comments.length > 0 &&
      findParentComment(newComment, comments[i].comments, parentId)) {
      // pass along the message
      console.log('DONE LOOKING AT', comments[i].content, 'SUBS', comments[i].comments);

      return true;
    }
  }
  // didn't find it in this tree
  return false;
}


router.post('/:postId/:commentId/replies', (req, res) => {
  const currentUser = req.user;
  const newComment = new Comment(req.body);
  newComment.author = currentUser._id;
  Post.findById(req.params.postId)
    .then((post) => {
      if (findParentComment(newComment, post.comments, req.params.commentId)) {
        post.markModified('comments');
        return post.save();
      }
      throw new Error('Parent comment not found');


      // // FIND PARENT USING BFS
      //
      // // create queue
      // const queue = post.comments;
      // // track visited nodes
      // const visited = [];
      // // while there is something in the queue
      // while (queue.length !== 0) {
      //   // pop out the first item
      //   const x = queue.shift();
      //   // check to see if it has been visited
      //   if (!visited[x._id] || visited[x._id] === false) {
      //     // mark as visited
      //     visited[x._id] = true;
      //     // if this comment matches the parent comment id
      //     if (x._id == req.params.commentId) {
      //       // insert the new comment
      //       x.comments.unshift(newComment);
      //       // save the post
      //       return post.save();
      //     }
      //     // for all the comments of this node
      //     for (let i = 0; i < x.comments.length; i += 1) {
      //       // grab the comment
      //       const comment = x.comments[i];
      //       // if it hasn't been visited
      //       if (!visited[comment._id] || visited[comment._id] === false) {
      //         // add it to the queue
      //         queue.push(comment);
      //       }
      //     }
      //   }
      // }
    }).then(post => res.redirect(`/posts/${post._id}`))
    .catch((err) => {
      console.error(err);
      return res.status(400).send();
    });
});

module.exports = router;
