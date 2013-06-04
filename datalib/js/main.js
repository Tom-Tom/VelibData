$(function() {

	/* MAP */
	var map = L.mapbox.map('map', 'etiwiti.panam')
	    .setView([48.856, 2.342], 13);
	map.attributionControl.removeFrom(map);

	/* DATA API JCDECEAUX */
	// $.get('https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris', function(data) {
	//   console.log(data);
	//   alert('Load was performed.');
	// });
	$.ajax({
	    url: 'https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris',
	    type: 'GET',
	    crossDomain: true,
	    dataType: 'jsonp',
	    success: function(data) {
	    	var type = '';
		    var velib = data;
		    var totalBikes = 0;
		    var totalStands = 0;
		    for (var i=0 ; i<velib.length ; i++) {
		    	addMarkers(map,velib[i],type);
		    	totalBikes = totalBikes + velib[i].available_bikes;
		    	totalStands = totalStands + velib[i].available_bike_stands;
		    };
	    },
	    error: function() { console.log('Fail load data API'); }
	});
	function addMarkers(map,velib,type){
		var lat = velib.position.lat;
		var lng = velib.position.lng;
		var name = velib.name.slice(7);
		var text = "<strong>Address : </strong>"+velib.address;
		text=text+"<br/><strong>Available bike stands : </strong>"+velib.available_bike_stands;
		text=text+"<br/><strong>Available bikes : </strong>"+velib.available_bikes;
		text=text+"<br/><strong>Last update : </strong>"+formattedTime(velib.last_update);
		text=text+"("+diffTime(velib.last_update)+"sec ago)";
		var pourcent = 100 * velib.available_bikes / velib.bike_stands;
		var color = "#333333";
		if(pourcent <= 20){
			color = "#2B00DD";
		} else if(pourcent <= 40){
			color = "#5500BB";
		} else if(pourcent <= 60){
			color = "#800099";
		} else if(pourcent <= 80){
			color = "#AA0077";
		} else if(pourcent <= 120){
			color = "#D50055";
		}
		if(type!="circle"){
			var circle_options = {
			    color: color,      // Stroke color
			    opacity: 0.6,         // Stroke opacity
			    weight: 5,         // Stroke weight
			    fillColor: '#000000',  // Fill color
			    fillOpacity: 0.4    // Fill opacity
			};
			L.circle(velib.position, 50, circle_options).addTo(map);
		} else {
			L.mapbox.markerLayer({
			    type: 'Feature',
			    geometry: {
			        type: 'Point',
			        coordinates: [lng, lat]
			    },
			    properties: {
			        title: '<h3>'+name+'</h3>',
			        description: text,
			        'marker-size': 'small',
			        'marker-color': color,
			        'marker-symbol': 'bicycle'
			    }
			}).addTo(map);
		}
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
});