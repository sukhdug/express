var task = require('../models/task');
var user = require('../models/user');

function isEmpty(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

exports.index = function(req, res, next) {
  if (isEmpty(req.session.authUser)) {
    res.redirect('/');
  } else if (req.session.authUser) {
    if (req.session.authUser.role === 'user') {
      if (isEmpty(req.query)) {
        var userId = req.session.authUser._id;
        task.findAllOfUser(userId, function (tasks) {
          res.render('tasks/index', {
            title: "All tasks",
            message: "Here shown all tasks",
            tasks: tasks
          });
        });
      } else if (req.query) {
        var importance = req.query.importance;
        var userId = req.session.authUser._id;
        task.findByImportanceOfUser(userId, importance, function (tasks) {
          res.render('tasks/index', {
            title: "All tasks",
            message: "Here shown all tasks",
            tasks: tasks
          });
        });
      }
    }
    if (req.session.authUser.role === 'admin') {
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
  }
}

exports.view = function(req, res, next) {
  var id = req.params.id;
  task.findTaskById(id, function (task) {
    res.render('tasks/view', {
      title: "Full information of task",
      task: task
    });
  });
}

exports.create = function(req, res, next) {
  if (isEmpty(req.session.authUser)) {
    res.redirect('/');
  } else if (req.session.authUser) {
    res.render('tasks/create', {
      title: "Create task",
      message: "Create task",
      name: '',
      author: req.session.authUser.fullName,
      description: '',
      importance: '',
      deadline: ''
    });
  }
}

exports.createResult = function(req, res, next) {
  if (req.body) {
    var data = {
      name: req.body.name,
      author: req.session.authUser,
      description: req.body.description,
      importance: req.body.importance,
      status: 'open',
      deadline: req.body.deadline
    }
    var result = task.create(data);
    if (result === 1) {
      res.send('Success');
    } else {
      res.render('tasks/create', {
        title: "Create task",
        message: result,
        name: req.body.name,
        author: req.body.author,
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
