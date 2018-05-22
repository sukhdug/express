var task = require('../models/task');
var user = require('../models/user');
var middleware = require('../config/middleware');

exports.index = function(req, res) {
  var permission = req.session.authUser.role;
  if (middleware.isEmpty(req.query)) {
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
    var page = 0;
    if (req.query.page > 0) {
      page = req.query.page;
    }
    console.log(page);
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
    getTasksByParameters(data, page);
  }
  function getTasksByParameters (data, page) {
    task.findAllByParameters(data, page, function (tasks, pages) {
      res.render('tasks/index', {
        title: "Tasks",
        flashSuccess: req.flash('success'),
        tasks: tasks
      });
    });
  }
}

exports.view = function(req, res) {
  var id = req.params.id;
  task.findTaskById(id, function (task) {
    if (task == null) {
      res.send('404! Sorry, task not found or deleted!<br>' +
        '<a href="/tasks">Back to tasks list</a>');
    } else {
      var userPermission = (req.session.authUser._id == task.authorId &&
        req.session.authUser.role == 'user');
      var adminPermission = (req.session.authUser.role == 'admin');
      if (userPermission || adminPermission) {
        res.render('tasks/view', {
          flashSuccess: req.flash('success'),
          title: "Full information of task",
          task: task
        });
      } else {
        res.send('403! You don\'t have permission<br><a href="/tasks">' +
                'Back to list of tasks</a>');
      }
    }
  });
}

exports.createGet = function(req, res) {
  res.render('tasks/create', {
    title: "Create task",
    message: "Create task",
    flashError: req.flash('error'),
    name: '',
    author: req.session.authUser.fullName,
    description: '',
    importance: '',
    deadline: ''
  });
}

exports.createPost = function(req, res) {
  if (req.body) {
    var data = {
      name: req.body.name,
      author: req.session.authUser,
      description: req.body.description,
      importance: req.body.importance,
      status: 'open',
      deadline: req.body.deadline
    }
    var errors = task.validation(data);
    if (errors == 0) {
      task.create(data, function(err, task) {
        if (err) {
          res.send("500 Server error<br><a href='/tasks'>Back to tasks list</a>");
        } else {
          req.flash('success', 'Task successfully created');
          res.redirect(301, '/tasks/view/' + task._id);
        }
      });
    } else {
      req.flash('error', errors);
      res.render('tasks/create', {
        title: "Create task",
        flashError: req.flash('error'),
        name: req.body.name,
        author: req.body.author,
        description: req.body.description,
        importance: req.body.importance,
        deadline: req.body.deadline
      });
    }
  }
}

exports.updateGet = function(req, res) {
  var id = req.params.id;
  task.findTaskById(id, function (task) {
    if (task == null) {
      res.send('404! Sorry, task not found or deleted!<br>' +
        '<a href="/tasks">Back to tasks list</a>');
    } else {
      var userPermission = (req.session.authUser._id == task.authorId &&
        req.session.authUser.role == 'user');
      var adminPermission = (req.session.authUser.role == 'admin');
      if (userPermission || adminPermission) {
        res.render('tasks/update', {
          title: "Update task",
          message: "Input data of task",
          id: id,
          flashError: req.flash('error'),
          name: task.name,
          description: task.description,
          importance: task.importance,
          deadline: task.deadline
        });
      } else {
        res.send('403! You don\'t have permission<br><a href="/tasks">' +
                'Back to list of tasks</a>');
      }
    }
  });
}

exports.updatePost = function(req, res) {
  var id = req.params.id;
  if (req.body) {
    var data = {
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      importance: req.body.importance,
      deadline: req.body.deadline,
      closed: req.body.closed ? true : false
    }
    var result = task.update(data);
    if (result === 1) {
      req.flash('success', 'Info of the task updated');
      res.redirect(301, '/tasks/view/' + id);
    } else {
      req.flash('error', result);
      res.render('tasks/update', {
        title: "Update of task",
        flashError: req.flash('error'),
        id: id,
        name: req.body.name,
        description: req.body.description,
        importance: req.body.importance,
        deadline: req.body.deadline
      });
    }
  }
}

exports.deleteGet = function(req, res) {
  var id = req.params.id;
  task.findTaskById(id, function (task) {
    if (task == null) {
      res.send('404! Sorry, task not found or deleted!<br>' +
        '<a href="/tasks">Back to tasks list</a>');
    } else {
      var userPermission = (req.session.authUser._id == task.authorId &&
        req.session.authUser.role == 'user');
      var adminPermission = (req.session.authUser.role == 'admin');
      if (userPermission || adminPermission) {
        res.render('tasks/delete', {
          title: "Delete task",
          message: "Do you have delete task?",
          id: id,
          flashError: req.flash('error'),
        });
      } else {
        res.send('403! You don\'t have permission<br><a href="/tasks">' +
                'Back to list of tasks</a>');
      }
    }
  });
}

exports.deletePost = function(req, res) {
  var id = req.params.id;
  task.remove(id, function(result) {
    res.send(result + "<br><a href='/tasks'>Back to tasks list</a>");
  });
}
