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
  status: {
    type: String,
    required: true
  },
  deadline: Date,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  closed: Date
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;
