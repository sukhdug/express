var express = require('express');
var app = express();
var main = require('../controllers/main');

// mount routes
app.get('/', main.home);

module.exports = app
