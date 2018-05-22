var express = require('express');
var task = require('../controllers/task');
var middleware = require('../config/middleware');
var app = express();

app.get('/', middleware.isLoggedIn, task.index);

app.get('/view/:id', middleware.isLoggedIn, task.view);

app.get('/create', middleware.isLoggedIn, task.createGet);

app.post('/create', middleware.isLoggedIn, task.createPost);

app.get('/update/:id', middleware.isLoggedIn, task.updateGet);

app.post('/update/:id', middleware.isLoggedIn, task.updatePost);

app.delete('/delete/:id', middleware.isLoggedIn, task.delete);

module.exports = app
