var express = require('express');

var Router = express.Router;

var main = new Router();

main.get('/', function (req, res) {
  res.send('Hello World');
});

exports.handler = main;
exports.path = '/';

