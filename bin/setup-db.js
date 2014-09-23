var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fuzzbutt');

var Points = require('../server/models/Points');

var places = [
  {
    name: 'London',
    coordinates: [ 51.5286416 , -0.1015987 ]
  },
  {
    name: 'Bristol',
    coordinates: [ 51.468489 , -2.5907094 ]
  },
  {
    name: 'Brighton',
    coordinates: [ 50.837418 , -0.1061897 ]
  },
  {
    name: 'Swindon',
    coordinates: [ 51.5697317 , -1.7923051 ]
  }
];

places.forEach(function (place) {
  Points.create({
    name: place.name,
    loc: {
      type: 'Point',
      coordinates: place.coordinates
    }
  });
});
