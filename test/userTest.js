var assert = require('chai').assert;
var user = require('../models/user');

var dataSuccess = {
  fullName: "Test Name",
  email: "test@mail.com",
  deadline: "2018-06-13",
  password: "password",
  repeatPassword: "password"
}

var _id = 0;
/*
  Test model
*/
describe('User', function() {
  describe('#validation', function() {
    it('should be return 0', function() {
      assert.equal(user.validation(dataSuccess), 0);
      assert.typeOf(user.validation(dataSuccess), "number");
    });
    it('should be return \"Please, input your full name!\"', function() {
      let dataEmptyFullName = { fullName: "" }
      assert.equal(user.validation(dataEmptyFullName), "Please, input your full name!");
      assert.typeOf(user.validation(dataEmptyFullName), "string");
    });
  });
  describe('#create', function() {
    it('should save without error', function(done) {
      user.create(dataSuccess, function(err, user) {
        if (err) done(err);
        else done();
        _id = user._id;
      });
    });
  });
  describe('#findByEmailAndPassword', function() {
    it('should get user without error', function(done) {
      var data = { email: "test@mail.com", password: "password"}
      user.findByEmailAndPassword(data, function(err, user) {
        if (err) done(err);
        else done();
      });
    });
  });
  describe('#remove', function() {
    it('should remove without error', function(done) {
      user.remove(_id, function(err, result) {
        if (err) done(err);
        else done();
      });
    });
  });
});
