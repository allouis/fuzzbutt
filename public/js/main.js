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

function submitLocation(data, cb) {
  var options = {
    method: 'POST',
    url: appUrl + endpoint.points,
    data: data,
    callback: cb
  };
  request(options);
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function(position) {
    var callback = function(data) {
      var loc = new google.maps.LatLng(data.loc.coordinates[0], data.loc.coordinates[1]);
      map.setCenter(loc);
      getPoints();
    };
    var data = {
      name: new Date().toString(),
      coordinates: [position.coords.latitude, position.coords.longitude]
    };
    submitLocation(data, callback);
  },
  function(error) {
    console.log(error);
  },{ timeout: 30000, enableHighAccuracy:false}
  );
} else {
  console.log('Permission denied');
}

initialize();
