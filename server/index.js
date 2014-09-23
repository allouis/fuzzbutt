var http = require('http');
var path = require('path');

var express = require('express');
var mongoose = require('mongoose');

// middleware
var errorHandler = require('errorhandler');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

var routers = require('./routers');

var pkg = require('../package.json');
var mongourl = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/fuzzbutt';
var env = process.env.NODE_ENV || 'development';

var app = express();
mongoose.connect(mongourl);

if (env === 'development') {
  app.use(errorHandler());
  mongoose.set('debug', true);
}

app.set('version', pkg.version);
app.set('views', path.join(__dirname + '/../views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser());
app.use(cookieParser('spa6kugo3chi4rti8wajy1no5ku'));
app.use(cookieSession({
  secret: 'asghfkjagfkf687sajhgfk'
}));

app.use(express.static(path.join(__dirname +'/../public')));

routers.forEach(function (router) {
  app.use(router.path, router.handler);
});

var server = http.createServer(app);

module.exports = server;

if (!module.parent) {
  server.listen(3000);
}
