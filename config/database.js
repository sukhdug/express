var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/express', function(err) {
  if (err) throw err;
  console.log('MongoDB successfully connected!');
});

module.exports = mongoose;
