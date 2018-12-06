
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();
chai.use(chaiHttp);

const agent = chai.request.agent(server);

const User = require("../models/user");

describe("User", function() {
  // TESTS WILL GO HERE.
});
