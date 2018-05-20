var Task = require('../entities/task');
var mongoose = require('mongoose');

var create = function(data) {
  var errors = validation(data);
  if (errors === 0) {
    console.log("Here 1");
    var task = new Task({
      _id: new mongoose.Types.ObjectId(),
      name: data.name,
      description: data.description,
      importance: data.importance,
      deadline: data.deadline
    });
    console.log("Here 2");
    task.save(function(err) {
      if (err) throw err;
      console.log('task successfully saved.');
    });
  } else {
    return errors;
  }
  return 1;
}

var findAll = function(callback) {
  Task.find({}).exec(function(err, tasks) {
    if (err) throw err;
    console.log(tasks);
    callback(tasks);
  });
}

var findByImportance = function(importance, callback) {
  Task.find({
    importance: importance
  }).exec(function(err, tasks) {
    if (err) throw err;
    console.log(tasks);
    callback(tasks);
  });
}

function validation(data) {
  var onlySpace = /^\s+$/i;
  var valDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i;
  if (onlySpace.test(data.name) || onlySpace.test(data.description)) {
    return "Incorrect name or description of task. Please check!";
  }
  if (!valDate.test(data.deadline) && data.deadline != '') {
    return "Incorrect date of deadline. Please check";
  }
  return 0;
}

module.exports = {
  create: create,
  findAll: findAll,
  findByImportance: findByImportance
}
