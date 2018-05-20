var task = require('../models/task');
var user = require('../models/user');

function isEmpty(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

exports.index = function(req, res, next) {
  req.session.message = 'Hello World';
  console.log(req.session.message);
  if (isEmpty(req.query)) {
    task.findAll( function (tasks) {
      res.render('tasks/index', {
        title: "All tasks",
        message: "Here shown all tasks",
        tasks: tasks
      });
    });
  } else if (req.query) {
    var importance = req.query.importance;
    task.findByImportance(importance, function (tasks) {
      res.render('tasks/index', {
        title: "All tasks",
        message: "Here shown all tasks",
        tasks: tasks
      });
    });
  }
}

exports.create = function(req, res, next) {
  res.render('tasks/create', {
    title: "Create task",
    message: "Create task",
    name: '',
    description: '',
    importance: '',
    deadline: ''
  });
}

exports.createResult = function(req, res, next) {
  if (req.body) {
    var data = {
      name: req.body.name,
      description: req.body.description,
      importance: req.body.importance,
      deadline: req.body.deadline,
      author: user.findByName('test')
    }
    var result = task.create(data);
    if (result === 1) {
      res.send('Success');
    } else {
      res.render('tasks/create', {
        title: "Create task",
        message: result,
        name: req.body.name,
        description: req.body.description,
        importance: req.body.importance,
        deadline: req.body.deadline
      });
    }
    console.log(req.body);
  }
}

exports.update = function(req, res, next) {
  res.send('Task update page');
}

exports.updateResult = function(req, res, next) {
  res.send('Task update result page');
}
