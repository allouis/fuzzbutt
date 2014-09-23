// CONFIG (Move to different file)
var endpoint = {
  points: 'points'
};

var markerImage = 'http://www.meadowsfield.com/wp-content/uploads/2013/09/map-icon-64.png';

var appUrl = window.location.href + 'api/';

// END CONFIG

var request = function (options) {
  var xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.addEventListener('load', function(event){
    options.callback(JSON.parse(event.target.responseText));
  });
  xhr.send(JSON.stringify(options.data || {}));
};
///////////////////////////////////////////////////
//
// Socket stuff
var socket = io.connect(window.location.href);

socket.on('locations', function (locations) {
  console.log(locations);
});

// Socket stuff end

function initialize() {
  var mapCanvas = document.getElementById('map_canvas');
  mapCanvas.style.height = window.innerHeight + 'px';
  var mapOptions = {
    center: new google.maps.LatLng(44.5403, -78.5463),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);
  window.map = map;
}

var Markers = (function () {

  var markers = {};

  var create = function (coords) {
    var id = Math.random().toString(26).slice(3);
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(coords[0], coords[1]),
      icon: markerImage,
      map: map
    });
    markers[id] = marker;
    marker.id = id;
    return marker;
  };

  var find = function (id) {
    return markers[id] || null;
  };

  return {
    create: create,
    find: find
  };

}());

function getPoints(){
  var options = {
    method: 'GET',
    url: appUrl + endpoint.points,
    callback: function(data) {
      var points = convertPoints(data);
      points.forEach(function(point) {
        addMarker(point);
      });
    }
  };
  request(options);
}

function convertPoints(points){
  return points.map(function(point){
    return {position: new google.maps.LatLng(point.loc.coordinates[0], point.loc.coordinates[1]),
      icon: markerImage,
      map: map
    };
  });
}

function addMarker(feature) {
  var marker = new google.maps.Marker({
    position: feature.position,
    icon: feature.icon,
    map: map
  });
}

function submitLocation(data) { 
  socket.emit('updatedLocation', data);
}
function success (position) {
  var data = {
    name: new Date().toString(),
    coordinates: [position.coords.latitude, position.coords.longitude]
  };
  submitLocation(data);
}

function error () {
  alert('BASE HAS BEEN FUCKED');
}

if (navigator.geolocation) {
  var geoOptions = { timeout: 30 * 1000, enableHighAccuracy: false };
  navigator.geolocation.watchPosition(success, error, geoOptions);
} else {
  console.log('Permission denied');
}

initialize();
