var Task = require('../entities/task');
var mongoose = require('mongoose');

var create = function(data) {
  var errors = validation(data);
  if (errors === 0) {
    var task = new Task({
      _id: new mongoose.Types.ObjectId(),
      name: data.name,
      author: data.author._id,
      description: data.description,
      importance: data.importance,
      status: data.status,
      deadline: data.deadline
    });
    task.save(function(err) {
      if (err) throw err;
      console.log('task successfully saved.');
    });
  } else {
    return errors;
  }
  return 1;
}

var update = function(data) {
  var errors = validation(data);
  if (errors === 0) {
    var id = data.id;
    console.log("error here 1");
    var data = {
      name: data.name,
      description: data.description,
      importance: data.importance,
      deadline: data.deadline,
      status: data.closed ? "closed" : "open",
      closed: data.closed ? new Date() : null
    }
    Task.update({ _id: id }, data, function(err, task) {
      if (err) throw err;
      console.log(task);
    });
  } else {
    return errors;
  }
  return 1;
}

var findTaskById = function(id, callback) {
  Task.findOne({
    _id: id
  })
  .populate('author', ['fullName'])
  .exec(function(err, task) {
    if (err) throw err;
    console.log(task);
    callback(task);
  });
}

var findAll = function(callback) {
  Task.find({})
  .populate('author', ['fullName'])
  .exec(function(err, tasks) {
    if (err) throw err;
    console.log(tasks);
    callback(tasks);
  });
}

var findAllOfUser = function(userId, callback) {
  Task.find({
    author: userId
  })
  .populate('author', ['fullName'])
  .exec(function(err, tasks) {
    if (err) throw err;
    console.log(tasks);
    callback(tasks);
  });
}

var findByImportance = function(importance, callback) {
  Task.find({
    importance: importance
  })
  .populate('author', ['fullName'])
  .exec(function(err, tasks) {
    if (err) throw err;
    console.log(tasks);
    callback(tasks);
  });
}

var findByImportanceOfUser = function(userId, importance, callback) {
  Task.find({
    author: userId,
    importance: importance
  })
  .populate('author', ['fullName'])
  .exec(function(err, tasks) {
    if (err) throw err;
    console.log(tasks);
    callback(tasks);
  });
}

function validation(data) {
  var onlySpace = /^\s+$/i;
  var valDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i;
  if (data.name.length === 0) {
    return "Please, input task name";
  }
  if (onlySpace.test(data.name) || onlySpace.test(data.description)) {
    return "Incorrect name or description of task. Please check!";
  }
  if (!valDate.test(data.deadline) && data.deadline != '') {
    return "Incorrect date of deadline. Please check!";
  }
  return 0;
}

module.exports = {
  create: create,
  update: update,
  findTaskById: findTaskById,
  findAll: findAll,
  findAllOfUser: findAllOfUser,
  findByImportance: findByImportance,
  findByImportanceOfUser: findByImportanceOfUser
}
