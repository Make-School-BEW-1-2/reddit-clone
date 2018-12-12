const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Comment = require('../models/comment.js')



const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
  },
  subreddit: {
    type: String,
    required: true,
  },
  comments: [Comment.schema],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  upVotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  downVotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  voteScore: [{
    type: Number,
    default: 0,
  }],
});

PostSchema.pre('save', function(next) {
  const now = new Date();
  this.updatedAt = now;

  next();
})

module.exports = mongoose.model("Post", PostSchema);
