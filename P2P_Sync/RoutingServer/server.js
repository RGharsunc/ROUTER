var exp = require('express');
var app = exp();
var http = require('http').Server(app);
var server = require('socket.io')(http);
var bodyParser = require('body-parser');
var io = require('socket.io-client');
var path = require('path');



module.exports = {

    exp: exp,
    app: app,
    http: http,
    server: server,
    bodyParser: bodyParser,
    io: io,
    path: path,
    projectDir: projectDir,
};


var projectDir = path.join(__dirname, '../', '../');
app.use(exp.static(projectDir));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());