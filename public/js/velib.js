/* config RAPHAEL linechart */
var r = Raphael('holder'),
	txtattr = { font: "12px sans-serif"};

tab = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // 25
function chart(tab){
	var x = [];
	for(i=0;i<tab.length;i++){x[i]=i;}
	r.remove();
	r = Raphael('holder');
	r.linechart(30,10,350,170,x,tab,{smooth: true,shade:true,axis:"0 0 0 1"});
}

var c = Raphael('circle'),
	txtattr = { font: "12px sans-serif"};

tabcircle = [25,25,50]; // 25
function circleChart(tab){
	c.remove();
	c = Raphael('circle');
	pie = c.piechart(260, 90, 50, tab, { legend: ["%%.%% Stands with Bikes", "%%.%% Stands with no bike", "%%.%% Stands Broken"], legendpos: "west"});
	pie.hover(function () {
	    this.sector.stop();
	    this.sector.scale(1.1, 1.1, this.cx, this.cy);

	    if (this.label) {
	        this.label[0].stop();
	        this.label[0].attr({ r: 7.5 });
	        this.label[1].attr({ "font-weight": 800 });
	    }
	}, function () {
	    this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");

	    if (this.label) {
	        this.label[0].animate({ r: 5 }, 500, "bounce");
	        this.label[1].attr({ "font-weight": 400 });
	    }
	});
}

/* GLOBAL */
type = "dqf";

/* CONFIG MAP */

var map = L.mapbox.map('map', 'etiwiti.map-91mhirzp')
    .setView([48.856, 2.342], 13);
map.attributionControl.removeFrom(map);

/* SOCKET */
var socket = io.connect('http://localhost');

socket.on('data', function (data) {
	localStorage.data = data;
    var velib = JSON.parse(data);
    var totalBikes = 0;
    var totalStands = 0;
    for (var i=0 ; i<velib.length ; i++) {
    	addMarkers(map,velib[i],type);
    	totalBikes = totalBikes + velib[i].available_bikes;
    	totalStands = totalStands + velib[i].available_bike_stands;
    };
});

socket.on('nb', function (data) {
    document.getElementById("countBikes").innerHTML = data.totalBikeAvailable;
    document.getElementById("countStands").innerHTML = data.totalStandAvailable;
    tab.shift();
   	tab.push(data.totalBikeAvailable);
   	chart(tab);
   	var tabcircle = [ data.percentBike, data.percentStand, data.percentBroken];
   	circleChart(tabcircle);
});

/* EVENT LISTENER */
document.getElementById("control").addEventListener("click", menuStatut() , false);
document.getElementById("showmarker").addEventListener("click", show("marker") , false); 
document.getElementById("showcircle").addEventListener("click", show("circle") , false); 
function show(arg){type=arg;}

/* FUNCTION */
function addMarkers(map,velib,TYPE){
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
	console.log(type);
	if(type!="circle"){
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


/* LOAD WINDOW */
function load(){
	console.log("ALLO");
}

window.onLoad = load();

