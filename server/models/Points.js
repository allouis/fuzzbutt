var mongoose = require('mongoose');

var pointsSchema = mongoose.Schema({
  name: String,
  loc: Object
});

var PointsModel = mongoose.model('Points', pointsSchema);
