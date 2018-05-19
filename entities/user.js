var mongoose = require('../config/database');

var userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
