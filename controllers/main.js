var user = require('../models/user');
var middleware = require('../config/middleware');

exports.home = function (req, res) {
  if (middleware.isEmpty(req.session.authUser)) {
    res.render('main/home', {
      title: "It is title",
      message: "It is message"
    });
  } else if (req.session.authUser) {
    res.redirect('/tasks');
  }
}

exports.registration = function (req, res) {
  if (req.session.authUser) {
    res.redirect('/');
  } else if (middleware.isEmpty(req.session.authUser)) {
    res.render('main/reg', {
      title: "Registration",
      message: "It is registration page",
      fullName: '',
      email: ''
    });
  }
}

exports.registrationResult = function (req, res) {
  if (req.body.password != req.body.repeatPassword) {
    res.render('main/reg', {
      title: "Registration",
      message: "Repeat password is wrong",
      fullName: req.body.fullName,
      email: req.body.email
    });
  } else {
    var data = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      admin: req.body.admin ? true : false
    }
    var result = user.create(data);
    if (result === 1) {
      res.send('You successfully registered.<br>' +
        'Please, <a href="/auth">login</a> with data:<br>' +
        'email: ' + data.email + '<br>' + 'password: ' + data.password);
    } else {
      res.render('main/reg', {
        title: "Registration",
        message: result,
        fullName: req.body.fullName,
        email: req.body.email
      });
    }
  }
}

exports.auth = function (req, res) {
  res.render('main/auth', {
    title: "Authorization",
    message: "It is authorization page",
    email: ''
  });
}

exports.authResult = function (req, res) {
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
        console.log(user);
        req.session.authUser = user;
        console.log(req.session.authUser);
        res.send('You authorized<br><a href="/">Back to homepage</a>');
      }
    });
  }
}

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect('/');
}
