var assert = require('chai').assert;
var task = require('../models/task');

var dataSuccess = {
  name: "Test",
  author: { _id: "5b0446ca0ed792135ab7d640", fullName: "test" },
  description: "Test description",
  importance: "normal",
  status: "open",
  deadline: "2018-06-13"
}

var _id = 0;
describe('Task', function(){
  describe('#validation', function(){
    it('should be return 0', function() {
      assert.equal(task.validation(dataSuccess), 0);
      assert.typeOf(task.validation(dataSuccess), "number");
    });
    it('should be return \"Please, input name of task\"', function() {
      let dataEmptyName = { name: "" }
      assert.equal(task.validation(dataEmptyName), "Please, input name of task");
      assert.typeOf(task.validation(dataEmptyName), "string");
    });
    it('should be return \"Incorrect name or description of task. Please check!\"',
      function(){
        let dataNameOnlySpace = {
          name: " ",
          description: "  ",
        }
        assert.equal(task.validation(dataNameOnlySpace), "Incorrect name or description" +
          " of task. Please check!");
        assert.typeOf(task.validation(dataNameOnlySpace), "string");
      });
    it('should be return \"Incorrect date of deadline. Please check!\"', function() {
      let dataErrorDeadline = {
        name: "Test",
        description: "Test",
        deadline: "20123-414-244"
      }
      assert.equal(task.validation(dataErrorDeadline), "Incorrect date of deadline." +
        " Please check!");
      assert.typeOf(task.validation(dataErrorDeadline), "string");
    });
  });
  describe('#create', function() {
    it('should save without error', function(done) {
      task.create(dataSuccess, function(err, task) {
        if (err) done(err);
        else done();
        _id = task._id;
      });
    });
  });
  describe('#update', function() {
    it('should update without error', function(done) {
      dataSuccess._id = _id;
      task.update(dataSuccess, function(err, task) {
        if (err) done(err);
        else done();
      });
    });
  });
  describe('#remove', function() {
    it('should remove without error', function(done) {
      task.remove(_id, function(result) {
        done();
      });
    });
  });
});
