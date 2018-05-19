var User = require('../entities/user');

var create = function(data) {
  var user = new User({
    _id: new mongoose.Types.ObjectId(),
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    role: data.role
  });
  user.save(function(err) {
    if (err) throw err;
    console.log('user successfully saved.');
  });
}

module.exports = {
  create: create
};
