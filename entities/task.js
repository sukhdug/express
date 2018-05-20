var mongoose = require('../config/database');

var taskSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  importance: {
    type: String,
    required: true
  },
  deadline: Date,
  readyDate: Date,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;
