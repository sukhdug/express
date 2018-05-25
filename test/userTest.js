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
});
