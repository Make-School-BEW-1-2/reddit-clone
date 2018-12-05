var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');


const User = require('../models/user');


/* GET users listing. */
router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(user => {
      const token = jwt.sign({
          _id: user._id
        },
        process.env.SECRET, {
          expiresIn: '60 days'
        }
      );
      res.cookie('redditClone', token, { maxAge: 900000, httpOnly: true });
      res.redirect("/");
    })
    .catch(err => {
      console.log(err.message);
    });
});

router.get('/logout', (req, res) => {
  res.clearCookie('redditClone');
  res.redirect('/')
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Find this user name
  User.findOne({ username }, "username password")
    .then(user => {
      if (!user) {
        // User not found
        return res.status(401).send({ message: "Wrong Username or Password" });
      }
      // Check the password
      user.comparePassword(password, (err, isMatch) => {
        if (!isMatch) {
          // Password does not match
          return res.status(401).send({ message: "Wrong Username or password" });
        }
        // Create a token
        const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
          expiresIn: "60 days"
        });
        // Set a cookie and redirect to root
        res.cookie("redditClone", token, { maxAge: 900000, httpOnly: true });
        res.redirect("/");
      });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
