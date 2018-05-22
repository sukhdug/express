var mongoose = require('mongoose');
var Task = require('../entities/task');

var create = function(data, callback) {
  var task = new Task({
    _id: new mongoose.Types.ObjectId(),
    name: data.name,
    author: data.author._id,
    description: data.description,
    importance: data.importance,
    status: data.status,
    deadline: data.deadline
  });
  task.save(function(err, task) {
    if (err) {
      callback(new Error("Server error"));
    }
    console.log('task successfully saved.');
    callback(null, task);
  });
}

var update = function(data) {
  var errors = validation(data);
  if (errors === 0) {
    var data = {
      _id: data._id,
      name: data.name,
      description: data.description,
      importance: data.importance,
      deadline: data.deadline,
      status: data.closed ? "closed" : "open",
      closed: data.closed ? new Date() : null
    }
    console.log(data._id);
    Task.update({ _id: data._id }, data, function(err, task) {
      if (err) throw err;
      console.log(task);
    });
  } else {
    return errors;
  }
  return 1;
}

var remove = function(id, callback) {
  Task.findOneAndRemove({_id: id}, function (err) {
    if (err) throw err;
    callback('Task deleted');
  });
}

var findTaskById = function(id, callback) {
  Task.findOne({
    _id: id
  })
  .populate('author', ['fullName'])
  .exec(function(err, task) {
    if (err) throw err;
    console.log(task);
    if (task == null) {
      callback(null);
    } else {
      var data = {
        _id: task._id,
        name: task.name,
        description: task.description,
        authorId: task.author._id,
        author: task.author.fullName,
        importance: task.importance,
        status: task.status,
        created: task.created.getFullYear() + '-' + task.created.getMonth()
          + '-' + task.created.getDate(),
        deadline: task.deadline != null ? task.deadline.getFullYear() + '-' +
          task.deadline.getMonth() + '-' + task.deadline.getDate() : 'no',
        closed: task.status == 'closed' ? task.closed.getFullYear() + '-' +
        task.closed.getMonth() + '.' + task.closed.getDate() : 'no',
      }
      callback(data);
    }
  });
}

var findAllByParameters = function(parameters, page, callback) {
  Task.find(parameters)
  .populate('author', ['fullName'])
  .limit(10)
  .skip(10 * page)
  .sort([['created', -1]])
  .exec(function(err, tasks) {
    if (err) throw err;
    console.log(tasks);
    var data = [];
    for (let i = 0; i < tasks.length; i++) {
      data[i] = {
        _id: tasks[i]._id,
        name: tasks[i].name,
        description: tasks[i].description,
        author: tasks[i].author.fullName,
        importance: tasks[i].importance,
        status: tasks[i].status,
        created: tasks[i].created.getFullYear() + '-' + tasks[i].created.getMonth() +
          '-' + tasks[i].created.getDate(),
        deadline: tasks[i].deadline != null ? tasks[i].deadline.getFullYear() +
          '-' + tasks[i].deadline.getMonth() + '-' + tasks[i].deadline.getDate() : 'no',
        closed: tasks[i].status == 'closed' ? tasks[i].closed.getFullYear() +
          '-' + tasks[i].closed.getMonth() + '-' + tasks[i].closed.getDate() : 'no',
      }
    }
    Task.count().exec(function(err, count) {
      var pages = count / 10;
      callback(data, pages);
    });
  });
}

var validation = function (data) {
  var onlySpace = /^\s+$/i;
  var valDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/i;
  if (data.name.length === 0) {
    return "Please, input name of task";
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
  remove: remove,
  findTaskById: findTaskById,
  findAllByParameters: findAllByParameters,
  validation: validation
}
