const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);

const Post = require('../models/post.js');

describe('Posts', () => {

  before((done) => {
    const user = {
      username: 'NotAUsername',
      password: 'thisisntit',
    };

    agent
      .post('/users/login')
      .send(user)
      .then((res) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should create with valid attributes at POST /posts', (done) => {
    const post = {
      title: 'post title',
      url: 'https://www.google.com',
      summary: 'post summary',
      author: '5c08495768e4c13b7deb7aca',
      subreddit: 'subreddit',
    };
    Post.findOneAndRemove(post)
      .then(() => {
        Post.find({})
          .then((posts) => {
            const postCount = posts.length || 0;

            agent
              .post('/posts/new')
              .send(post)
              .then((res) => {
                Post.find({})
                  .then((posts) => {
                    postCount.should.be.equal(posts.length - 1);
                    res.should.have.status(200);
                    return done();
                  })
                  .catch(err => done(err));
              })
              .catch(err => done(err));
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  });

  it('should not allow the creation of a post without all fields', (done) => {
    const post = {};

    agent
      .post('/posts/new')
      .send(post)
      .then((res) => {
        res.should.have.status(400);
        return done();
      })
      .catch(err => done(err));
  });
});
