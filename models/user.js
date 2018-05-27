var pbkdf2 = require('pbkdf2');
var User = require('../entities/user');
var mongoose = require('mongoose');

var create = function(data, callback) {
  var password = pbkdf2.pbkdf2Sync(data.password, 'salt', 1000, 32, 'sha512');
  var user = new User({
    _id: new mongoose.Types.ObjectId(),
    fullName: data.fullName,
    email: data.email,
    password: password,
    role: data.admin ? "admin" : "user"
  });
  user.save(function(err, user) {
    if (err) {
      callback(new Error("Server error"));
    } else {
      console.log('user successfully saved.');
      callback(null, user);
    }
  });
}

var remove = function(id, callback) {
  User.findOneAndRemove({_id: id}, function (err) {
    if (err) {
      callback(new Error("Remove error"));
    } else {
      callback(null, 'User deleted');
    }
  });
}

var findByEmailAndPassword = function(data, callback) {
  var password = pbkdf2.pbkdf2Sync(data.password, 'salt', 1000, 32, 'sha512');
  User.findOne({
      email: data.email,
      password: password
  }).exec(function(err, user) {
    if (err) {
      callback(new Error("Server error"));
    } else {
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
    }
  });
}

var validation = function (data) {
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
  remove: remove,
  findByEmailAndPassword: findByEmailAndPassword,
  validation: validation
};
