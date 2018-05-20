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
    user.save(function(err) {
      if (err) throw err;
      console.log('user successfully saved.');
    });
  } else {
    return errors;
  }
  return 1;
}

var findByName = function(data) {
  User.findOne({
    fullName: data
  }).exec(function(err, user) {
    if (err) throw err;
    console.log(user);
    return user;
  });
}

var findByEmail = function(data) {
  User.findOne({
      email: data.email
  }).exec(function(err, user) {
    if (err) throw err;
    console.log(user);
    return user;
  });
}

function validation(data) {
  var regName = /^[a-zA-Zа-яА-Я\s-]+$/i;
  if (!regName.test(data.fullName)) {
    return "Incorrect name. Please input only letters.";
  }
  if (data.password.length < 6) {
    return "Please, create a password greater than 6 characters";
  }
  return 0;
}

module.exports = {
  create: create,
  findByEmail: findByEmail,
  findByName: findByName
};
