var http = require('http');
var app = require('./app');

var port = process.env.PORT || '3000';

app.set('port', port);

var server = http.createServer(app);

server.listen(port, function() {
  console.log('The app is available at http://127.0.0.1:3000');
});
