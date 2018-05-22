var user = require('../models/user');
var middleware = require('../config/middleware');

exports.index = function (req, res) {
  if (middleware.isEmpty(req.session.authUser)) {
    res.render('main/index', {
      title: "It is title",
      message: "It is message"
    });
  } else if (req.session.authUser) {
    res.redirect('/tasks');
  }
}

exports.registrationGet = function (req, res) {
  if (req.session.authUser) {
    res.redirect('/');
  } else if (middleware.isEmpty(req.session.authUser)) {
    res.render('main/reg', {
      title: "Registration",
      flashError: req.flash('error'),
      fullName: '',
      email: ''
    });
  }
}

exports.registrationPost = function (req, res) {
  var data = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    repeatPassword: req.body.repeatPassword,
    admin: req.body.admin ? true : false
  }
  var errors = user.validation(data);
  if (errors === 0) {
    user.create(data, function(err, user) {
      req.session.authUser = user;
      req.flash('success', "You are authorized");
      res.redirect(301, '/');
    });
  } else {
    req.flash('error', result);
    res.render('main/reg', {
      title: "Registration",
      flashError: req.flash('error'),
      fullName: req.body.fullName,
      email: req.body.email
    });
  }
}

exports.authGet = function (req, res) {
  res.render('main/auth', {
    title: "Authorization",
    message: "It is authorization page",
    email: ''
  });
}

exports.authPost = function (req, res) {
  if (req.body) {
    var data = {
      email: req.body.email,
      password: req.body.password
    }
    user.findByEmailAndPassword(data, function (err, user) {
      if (err) {
        res.render('main/auth', {
          title: "Authorization",
          message: "Error! Maybe, email or password is wrong",
          email: req.body.email
        });
      } else {
        req.session.authUser = user;
        req.flash('success', "You are authorized");
        res.redirect(301, '/');
      }
    });
  }
}

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect('/');
}
