var user = require('../models/user');

function isEmpty(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

exports.home = function (req, res, next) {
  if (isEmpty(req.session.authUser)) {
    res.render('main/home', {
      title: "It is title",
      message: "It is message"
    });
  } else if (req.session.authUser) {
    res.redirect('/tasks');
  }
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
      res.redirect('/');
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
    message: "It is authorization page",
    email: ''
  });
}

exports.authResult = function (req, res, next) {
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
        res.send('You authorized<br><a href="/">Main page</a>');
      }
    });
    console.log(req.body);
  }
}

exports.logout = function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
}
