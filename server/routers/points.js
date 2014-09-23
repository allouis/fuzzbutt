var express = require('express');

var Points = require('../models/Points');

var points = new express.Router();

points.get('/', function (req, res, next) {
  Points.find({}, function (err, results) {
    console.log('Points.find:: err:', err, 'results:', results);
    if (err) {
      return next(err);
    }
    res.json(results);
    res.end();
  });
});

points.post('/', function (req, res, next) {
  var body = req.body;
  
  if (!body.name) {
    return res.send(401, 'Need a name field');
  }

  if (!body.coordinates) {
    return res.send(401, 'Need a coordinates array');
  }

  var point = Points.create({
    name: body.name,
    loc: {
      type: 'Point',
      coordinates: body.coordinates
    }
  });

  res.json(point);
  res.end();
  
});

points.get('/:name', function (req, res, next) {
  Points.findOne({name: req.params.name}, function (err, result) {
    if (err) {
      return next(err);
    }
    res.json(result);
  });
});

exports.handler = points;
exports.path = '/api/points';


