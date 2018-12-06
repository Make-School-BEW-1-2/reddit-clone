const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

const app = require('../app');

const agent = chai.request.agent(server);


const User = require('../models/user');

describe('User', () => {
  const user = {
    username: 'NotAUsername',
    password: 'thisisntit',
  };

  const badUser = {
    username: 'baduser',
    password: 'notpass'
  }

  it('should not be able to login if they have not registered', (done) => {
    agent
      .post('/users/login')
      .send(badUser)
      .then((res) => {
        res.status.should.be.equal(401);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should be able to sign up', (done) => {
    User.findOneAndRemove({
      username: user.username
    }, () => {
      agent
        .post('/users/sign-up')
        .send(user)
        .then((res) => {
          res.should.have.status(200);
          agent.should.have.cookie('redditClone');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  it('should be able to logout', (done) => {
    agent
      .get('/users/logout')
      .then((res) => {
        res.should.have.status(200);
        agent.should.not.have.cookie('redditClone');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should be able to login', (done) => {
    agent
      .post('/users/login')
      .send(user)
      .then((res) => {
        res.should.have.status(200);
        agent.should.have.cookie('redditClone');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
