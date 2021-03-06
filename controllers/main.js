var user = require('../models/user');
var middleware = require('../config/middleware');

exports.index = function (req, res) {
  if (middleware.isEmpty(req.session.authUser)) {
    res.redirect('/auth');
  } else if (req.session.authUser) {
    res.redirect('/tasks');
  }
}

exports.registrationGet = function (req, res) {
  if (req.session.authUser) {
    res.redirect('/');
  } else if (middleware.isEmpty(req.session.authUser)) {
    res.render('main/reg', {
      title: "Sign Up",
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
    req.flash('error', errors);
    res.render('main/reg', {
      title: "Sign Up",
      flashError: req.flash('error'),
      fullName: req.body.fullName,
      email: req.body.email
    });
  }
}

exports.authGet = function (req, res) {
  res.render('main/auth', {
    title: "Sign In",
    flashError: req.flash('error'),
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
        req.flash('error', "Error! Maybe, email or password is wrong");
        res.render('main/auth', {
          title: "Sign In",
          flashError: req.flash('error'),
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
