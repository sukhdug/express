var Task = require('../entities/task');

var create = function(data) {
  var task = new Task({
    _id: new mongoose.Types.ObjectId(),
    name: data.name,
    description: data.description,
    importance: data.importance,
    deadline: data.deadline,
    readyDate: data.readyDate,
    author: data.user._id,
  });
  task.save(function(err) {
    if (err) throw err;
    console.log('task successfully saved.');
  });
}

module.exports = {
  create: create
}
