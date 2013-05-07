var map = L.mapbox.map('map', 'examples.map-4l7djmvo')
    .setView([48.856, 2.342], 13);

var socket = io.connect('http://localhost');

socket.on('data', function (data) {
    var velib = JSON.parse(data);
    for (var i=0 ; i<velib.length ; i++) {
    	addMarkers(map,velib[i].position.lng,velib[i].position.lat);
    };
});

function addMarkers(map,lat,lng){
	L.mapbox.markerLayer({
	    type: 'Feature',
	    geometry: {
	        type: 'Point',
	        coordinates: [lat, lng]
	    },
	    properties: {
	        title: 'A Single Marker',
	        description: 'Just one of me',
	        'marker-size': 'medium',
	        'marker-color': '#ff4444',
	        'marker-symbol': 'bicycle'
	    }
	}).addTo(map);
}