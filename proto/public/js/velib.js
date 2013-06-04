/* config RAPHAEL linechart */
var r = Raphael('holder'),
	txtattr = { font: "12px sans-serif"};

tab = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // 25
function chart(tab){
	var x = [];
	var i = 0;
	var back = 0;
	while((tab[i]==0)||(i<tab.length)){
		back=tab[i];
		i++;
	}
	for(i=0;i<tab.length;i++){
		x[i]=i;
		if(tab[i]==0){
			tab[i]=back
		}
	}
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
	pie = c.piechart(270, 90, 75, tab, { legend: ["%%.%% Stands with Bikes", "%%.%% Stands with no bike", "%%.%% Stands Broken"], legendpos: "west"});
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
console.log(map);
/* SOCKET */
var socket = io.connect('http://localhost');

socket.on('data', function (data) {
	localStorage.data = data;
    var velib = JSON.parse(data);
    var totalBikes = 0;
    var totalStands = 0;
    var delaunay = [];
    for (var i=0 ; i<velib.length ; i++) {
    	addMarkers(map,velib[i],type);
    	totalBikes = totalBikes + velib[i].available_bikes;
    	totalStands = totalStands + velib[i].available_bike_stands;
    	// var obj = { x:(velib[i].position.lng-2)*500,y:(velib[i].position.lat-48)*500};
    	// delaunay.push(obj);
    };
						// var canvas = document.getElementById("canvas"),
						// ctx = canvas.getContext("2d"),
						// i = 250,
						// vertices = new Array(i),
						// x, y
						// while(i) {
						// 	do {
						// 		x = Math.random() - 0.5
						// 		y = Math.random() - 0.5
						// 	} while(x * x + y * y > 0.25)
						// 	x = (x * 0.96875 + 0.5) * canvas.width
						// 	y = (y * 0.96875 + 0.5) * canvas.height
						// 	vertices[--i] = {x: x, y: y}
						// }
						// console.time("triangulate")
						// var triangles = triangulate(delaunay)
						// console.timeEnd("triangulate")
    					// console.log(delaunay);
						// console.log(vertices);
						// i = triangles.length
						// while(i)
						// 	triangles[--i].draw(ctx)
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

function menuStatut(elem){
 //console.log(elem);
}


document.getElementById('control').addEventListener('click',function(){
	var panel = document.getElementsByTagName('footer')[0];
	var control = document.getElementById('control');
	console.log('ALLO');
	if(panel.className == "hidePanel"){
		panel.className = "showPanel";
		control.className = "showControl";
	} else {
		panel.className = "hidePanel";
		control.className = "hideControl";
	}
},false);

/* LOAD WINDOW */
function load(){
	// console.log(document.getElementsByTagName('path'));
	// document.getElementsByTagName('g').addEventListener('hover',function(){
	// 	console.log(this);
	// });
	map.legendControl.addLegend(document.getElementById('legend-content').innerHTML);
}

window.onLoad = load();
