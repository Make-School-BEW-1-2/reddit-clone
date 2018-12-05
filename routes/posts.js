const express = require('express');
const router = express.Router();

const Post = require('../models/post.js')

router.get('/', (req, res) => {
    Post.find()
        .then((posts) => {
            res.render('posts-index', {
                posts
            });
        })
        .catch((err) => {
            console.error(err.message);
        })
})

router.get('/new', (req, res) => {
    res.render('posts-new');
});

router.post('/new', (req, res) => {
    const newPost = Post(req.body);
    console.log(req.body)
    newPost.save((err, post) => {
        return res.redirect('/');
    })
})

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
    .populate('comments')
        .then((post) => {
          console.log(post.comments);
            res.render('post-show', { post });
        })
        .catch((err) => {
            console.error(err.message);
        })
})

module.exports = router;
