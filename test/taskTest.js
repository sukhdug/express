var task = require('../models/task');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
var assert = chai.assert;
let should = chai.should();
chai.use(chaiHttp);

var dataSuccess = {
  name: "Test",
  author: { _id: "5b0444fd26268b11ecf5faae", fullName: "test" },
  description: "Test description",
  importance: "normal",
  status: "open",
  deadline: "2018-06-13"
}

var _id = 0;
/*
  Test model
*/
describe('Task', function() {
  describe('#validation', function() {
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
  describe('#findTaskById', function() {
    it('should find task without error', function(done) {
      task.findTaskById(_id, function(err, task) {
        if (err) done(err);
        done();
      });
    });
  });
  describe('#findAllByParameters', function() {
    it('should find tasks without error', function(done) {
      task.findAllByParameters({}, 0, function(tasks, pages) {
        done();
      });
    });
    it('should find tasks without error', function(done) {
      var data = {
        status: 'open',
        importance: 'normal'
      }
      task.findAllByParameters(data, 0, function(tasks, pages) {
        done();
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
/*
  Test controller
*/
describe('/GET tasks', function() {
  it('should GET all the tasks', (done) => {
    chai.request(server)
    .get('/tasks')
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });
});
