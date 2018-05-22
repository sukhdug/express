var express = require('express');
var app = express();
var main = require('../controllers/main');

app.get('/', main.index);

app.get('/reg', main.registrationGet);

app.post('/reg', main.registrationPost);

app.get('/auth', main.authGet);

app.post('/auth', main.authPost);

app.get('/logout', main.logout);

module.exports = app
