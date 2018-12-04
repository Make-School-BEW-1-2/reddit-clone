const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();

const app = require('../app');

chai.use(chaiHttp);

const Post = require('../models/post.js');

describe("Posts", () => {
  it("should create with valid attributes at POST /posts", done => {
    const post = {
      title: "post title",
      url: "https://www.google.com",
      summary: "post summary"
    };
    Post.findOneAndRemove(post)
      .then(() => {
        Post.find({})
          .then((posts) => {
            const postCount = posts.length || 0;

            chai
              .request(app)
              .post("/posts/new")
              .send(post)
              .then(res => {
                Post.find({})
                  .then((posts) => {
                    postCount.should.be.equal(posts.length - 1);
                    res.should.have.status(200);
                    return done();
                  })
                  .catch((err) => {
                    console.error(err.message);
                  });
              })
              .catch(err => {
                return done(err);
              });
          })
          .catch((err) => {
            return done(err);
          });
      })
      .catch((err) => {
        console.error(err.message);
      });
  });
  it("should not allow the creation of a post without all fields", (done) => {
    const post = {

    }

    chai
      .request(app)
      .post("/posts/new")
      .send(post)
      .then(res => {
        console.log(res.status);
        return done();
      })
      .catch((err) => {
        console.error(err.message);
      });
  })
})
