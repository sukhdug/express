var user = require('../models/user');

exports.home = function (req, res, next) {
  res.render('main/home', {
    title: "It is title",
    message: "It is message"
  });
}

exports.registration = function (req, res, next) {
  res.render('main/reg', {
    title: "Registration",
    message: "It is registration page",
    fullName: '',
    email: ''
  });
}

exports.registrationResult = function (req, res, next) {
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
      res.send('Success');
    } else {
      res.render('main/reg', {
        title: "Registration",
        message: result,
        fullName: req.body.fullName,
        email: req.body.email
      });
    }
  }
  if (req.body) {
    console.log(req.body);
  }
}

exports.auth = function (req, res, next) {
  res.render('main/auth', {
    title: "Authorization",
    message: "It is authorization page"
  });
}
