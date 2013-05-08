/* TEST */

var r = Raphael('holder'),
	txtattr = { font: "12px sans-serif"};

var tab = [10,20,30,20,10,0,10];
function chart(tab){
	var x = [];
	for(i=0;i<tab.length;i++){x[i]=i;}
	r.remove();
	r = Raphael('holder');
	r.linechart(10,10,350,170,x,tab,{smooth: true,shade:true,axis:"0 0 0 1"});
}


var compteur = 0;
function EcritureLigne(){
   compteur += 1;
   tab.push("15");
   chart(tab);
   // Rappel de la fonction en boucle
   exempleTimeout = setTimeout("EcritureLigne()", 2000);
   if(compteur >= 10){
      window.clearTimeout(exempleTimeout);
   }
}
// Premier appel à la fonction EcritureLigne après 2 secondes
var exempleTimeout = setTimeout("EcritureLigne()", 2000);

/* GLOBAL */
TYPE = "dqf";

/* START */

var map = L.mapbox.map('map', 'etiwiti.map-91mhirzp')
    .setView([48.856, 2.342], 12);
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
document.getElementById("showmarker").addEventListener("click", show("marker") , false); 
document.getElementById("showcircle").addEventListener("click", show("circle") , false); 


console.log(L.map);
function show(arg){
	//TYPE=arg;
}

function addMarkers(map,velib){
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
	console.log(TYPE);
	if(TYPE=="circle"){
		var circle_options = {
		    color: '#00FF00',      // Stroke color
		    opacity: 0,         // Stroke opacity
		    weight: 50,         // Stroke weight
		    fillColor: color,  // Fill color
		    fillOpacity: 0.7    // Fill opacity
		};
		L.circle(velib.position, 150, circle_options).addTo(map);
	} else {
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

function menuStatut(elem){
 //console.log(elem);
}

function load(){
	console.log("ALLO");
}

window.onLoad = load();

