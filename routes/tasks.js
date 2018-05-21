var express = require('express');
var app = express();
var task = require('../controllers/task');

app.get('/', task.index);

app.get('/view/:id', task.view);

app.get('/create', task.create);

app.post('/create', task.createResult);

app.get('/update/:id', task.update);

app.put('/update/:id', task.updateResult);

module.exports = app
