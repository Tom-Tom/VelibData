var map = L.mapbox.map('map', 'examples.map-20v6611k')
    .setView([48.856, 2.342], 13);

map.attributionControl.removeFrom(map);

var socket = io.connect('http://localhost');

socket.on('data', function (data) {
	localStorage.data = data;
    var velib = JSON.parse(data);
    var totalBikes = 0;
    var totalStands = 0;
    for (var i=0 ; i<velib.length ; i++) {
    	addMarkers(map,velib[i]);
    	totalBikes = totalBikes + velib[i].available_bikes;
    	totalStands = totalStands + velib[i].available_bike_stands;
    };
    document.getElementById("countBikes").innerHTML = totalBikes;
    document.getElementById("countStands").innerHTML = totalStands;
});

document.getElementById("control").addEventListener("click", menuStatut() , false); 

function addMarkers(map,velib){
	var lat = velib.position.lat;
	var lng = velib.position.lng;
	var name = velib.name.slice(7);
	var text = "<strong>Address : </strong>"+velib.address;
	text=text+"<br/><strong>Available bike stands : </strong>"+velib.available_bike_stands;
	text=text+"<br/><strong>Available bikes : </strong>"+velib.available_bikes;
	text=text+"<br/><strong>Last update : </strong>"+formattedTime(velib.last_update);
	text=text+"("+diffTime(velib.last_update)+"sec ago)";
	L.mapbox.markerLayer({
	    type: 'Feature',
	    geometry: {
	        type: 'Point',
	        coordinates: [lng, lat]
	    },
	    properties: {
	        title: name,
	        description: text,
	        'marker-size': 'small',
	        'marker-color': '#333333',
	        'marker-symbol': 'bicycle'
	    }
	}).addTo(map);
}

function formattedTime(timestamp){
	var date = new Date(timestamp);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var time = hours + 'h:' + minutes + 'm:' + seconds+ 's:';
	return time;
}

function diffTime(timestamp){
	var nowDate = new Date().getTime();
	nowDate = nowDate - timestamp;
	return formattedTime(nowDate);
}

function menuStatut(elem){
 console.log(elem);
}