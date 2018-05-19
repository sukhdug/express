var http = require('http');
var debug = require('debug')('express-blog:server');
var app = require('./app');

var port = process.env.PORT || '3000';

app.set('port', port);

var server = http.createServer(app);

server.listen(port, function () {
  console.log('App access on address http://localhost:3000 or http://127.0.0.1:3000!');
});
