var express = require('express');
var app = express();
var task = require('../controllers/task');

app.get('/', task.index);

app.get('/create', task.create);

app.post('/create', task.createResult);

app.get('/update', task.update);

app.post('/update', task.updateResult);

module.exports = app
