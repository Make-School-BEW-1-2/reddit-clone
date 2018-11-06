const express = require('express');
const router = express.Router();

const Post = require('../models/post.js')

router.get('/new', (req, res) => {
    res.render('posts-new');
});

router.post('/new', (req, res) => {
    const newPost = Post(req.body);

    newPost.save((err, post) => {
        return res.redirect('/');
    })
})

module.exports = router;
