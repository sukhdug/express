var express = require('express');
var task = require('../controllers/task');
var middleware = require('../config/middleware');
var app = express();

app.get('/', middleware.isLoggedIn, task.index);

app.get('/view/:id', middleware.isLoggedIn, task.view);

app.get('/create', middleware.isLoggedIn, task.create);

app.post('/create', middleware.isLoggedIn, task.createResult);

app.get('/update/:id', middleware.isLoggedIn, task.update);

app.put('/update/:id', middleware.isLoggedIn, task.updateResult);

app.delete('/delete/:id', middleware.isLoggedIn, task.delete);

module.exports = app
