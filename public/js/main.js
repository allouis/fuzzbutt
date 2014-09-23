// CONFIG (Move to different file)
var endpoint = {
  points: 'points'
};

var appUrl = 'http://localhost:3000/api/';

// END CONFIG

var request = function (options) {
  var xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.addEventListener('loaded', options.callback);
  xhr.send(JSON.stringify(options.data || {}));
};
///////////////////////////////////////////////////

function initialize() {
  var mapCanvas = document.getElementById('map_canvas');
  var mapOptions = {
    center: new google.maps.LatLng(44.5403, -78.5463),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.HYBRID
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);
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
    var callback = function(event) {
      console.log(event);
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

google.maps.event.addDomListener(window, 'load', initialize);
