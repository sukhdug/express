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
    var permission = req.session.authUser.role;
    if (isEmpty(req.query)) {
      if (permission === 'user') {
        var data = {
          author: req.session.authUser._id
        }
        getTasksByParameters(data);
      }
      if (permission === 'admin') {
        getTasksByParameters({});
      }
    } else if (req.query) {
      var data = {};
      if (req.session.authUser.role == 'user') {
        data.author = req.session.authUser._id;
      }
      if (req.query.importance == 'all' && req.query.status != 'all') {
        data.status = req.query.status;
      }
      if (req.query.status == 'all' && req.query.importance != 'all') {
        data.importance = req.query.importance;
      }
      if (req.query.status != 'all' && req.query.importance != 'all') {
        data.importance = req.query.importance;
        data.status = req.query.status;
      }
      getTasksByParameters(data);
    }
    function getTasksByParameters (data) {
      task.findAllByParameters(data, function (tasks) {
        res.render('tasks/index', {
          title: "All tasks",
          message: "Here shown all tasks",
          tasks: tasks
        });
      });
    }
  }
}

exports.view = function(req, res, next) {
  if (isEmpty(req.session.authUser)) {
    res.redirect('/');
  } else if (req.session.authUser) {
    var id = req.params.id;
    task.findTaskById(id, function (task) {
      var userPermission = (req.session.authUser._id == task.author._id &&
        req.session.authUser.role == 'user');
      var adminPermission = (req.session.authUser.role == 'admin');
      if (userPermission || adminPermission) {
        res.render('tasks/view', {
          title: "Full information of task",
          task: task,
          author: task.author,
          created: task.created.getDate() + '-' + (task.created.getMonth() + 1)
          + '-' + task.created.getFullYear(),
          deadline: task.deadline != null ? task.deadline.getDate() + '-' +
          (task.deadline.getMonth() + 1) + '-' + task.deadline.getFullYear() : 'no',
          closed: task.status == 'closed' ? task.deadline.getDate() +
          '-' + (task.deadline.getMonth() + 1) + '-' + task.deadline.getFullYear() : 'no'
        });
      } else {
        res.send('403! You don\'t have permission<br><a href="/tasks">' +
                'Back to list of tasks</a>');
      }
    });
  }
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
    if (isEmpty(req.session.authUser)) {
      res.redirect('/');
    } else if (req.session.authUser) {
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
        res.send('Task successfully created<br><a href="/tasks">' +
                'Back to list of tasks</a>');
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
}

exports.update = function(req, res, next) {
  var id = req.params.id;
  if (isEmpty(req.session.authUser)) {
    res.redirect('/');
  } else if (req.session.authUser) {
    task.findTaskById(id, function (task) {
      res.render('tasks/update', {
        title: "Update task",
        message: "Please, update information about task",
        id: id,
        task: task,
      });
    });
  }
}

exports.updateResult = function(req, res, next) {
  if (req.body) {
    var data = {
      id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      importance: req.body.importance,
      deadline: req.body.deadline,
      closed: req.body.closed ? true : false
    }
    var result = task.update(data);
    if (result === 1) {
      res.send('Success');
    } else {
      res.render('tasks/update', {
        title: "Update task",
        message: result,
        name: req.body.name,
        description: req.body.description,
        importance: req.body.importance,
        deadline: req.body.deadline
      });
    }
  }
}
