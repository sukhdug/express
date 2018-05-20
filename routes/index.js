var express = require('express');
var app = express();
var main = require('../controllers/main');

app.get('/', main.home);

app.get('/reg', main.registration);

app.post('/reg', main.registrationResult);

app.get('/auth', main.auth);

app.post('/auth', main.authResult);

module.exports = app
