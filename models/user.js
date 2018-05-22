var pbkdf2 = require('pbkdf2');
var User = require('../entities/user');
var mongoose = require('mongoose');

var create = function(data) {
  var errors = validation(data);
  if (errors === 0) {
    var password = pbkdf2.pbkdf2Sync(data.password, 'salt', 1000, 32, 'sha512');
    var user = new User({
      _id: new mongoose.Types.ObjectId(),
      fullName: data.fullName,
      email: data.email,
      password: password,
      role: data.admin ? "admin" : "user"
    });
    user.save(function(err, user) {
      if (err) throw err;
      console.log('user successfully saved.');
      console.log(user);
    });
  } else {
    return errors;
  }
  return 1;
}

var findAll = function(callback) {
  User.find({}).exec(function(err, users) {
    if (err) throw err;
    console.log(users);
    callback(users);
  });
}

var findByEmailAndPassword = function(data, callback) {
  var password = pbkdf2.pbkdf2Sync(data.password, 'salt', 1000, 32, 'sha512');
  User.findOne({
      email: data.email,
      password: password
  }).exec(function(err, user) {
    if (err) {
      throw err;
      callback(new Error("Server error"));
    }
    console.log(user);
    if (user !== null) {
      var data = {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
      callback(null, data);
    } else {
      callback(new Error("User not found"));
    }
  });
}

var checkExistEmail = function (email, callback) {
  User.findOne({
    email: email
  }).exec(function(err, user) {
    if (err) throw err;
    if (user == null) {
      callback('no');
    } else {
      callback('yes');
    }
  });
}

function validation(data) {
  var regName = /^[a-zA-Zа-яА-Я\s-]+$/i;
  if (data.fullName.length == 0) {
    return "Please, input your full name!";
  }
  if (data.email.length == 0) {
    return "Please, input your email!";
  }
  if (data.password.length == 0) {
    return "Please, input your password";
  }
  if (!regName.test(data.fullName)) {
    return "Incorrect name. Please input only letters.";
  }
  if (data.repeatPassword.length == 0) {
    return "Repeat password is wrong";
  }
  if (data.password != data.repeatPassword) {
    return "Repeat password is wrong";
  }
  if (data.password.length < 5) {
    return "Please, create a password greater than 5 characters";
  }
  return 0;
}

module.exports = {
  create: create,
  findAll: findAll,
  findByEmailAndPassword: findByEmailAndPassword
};
