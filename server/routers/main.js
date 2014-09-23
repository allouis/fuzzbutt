var express = require('express');

var Router = express.Router;

var main = new Router();

main.get('/', function (req, res) {
  res.render('index');
});

exports.handler = main;
exports.path = '/';

