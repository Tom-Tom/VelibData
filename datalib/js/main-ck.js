$(function(){function t(e,t,i){var s=t.position.lat,o=t.position.lng,u=t.name.slice(7),a="<strong>Address : </strong>"+t.address;a=a+"<br/><strong>Available bike stands : </strong>"+t.available_bike_stands;a=a+"<br/><strong>Available bikes : </strong>"+t.available_bikes;a=a+"<br/><strong>Last update : </strong>"+n(t.last_update);a=a+"("+r(t.last_update)+"sec ago)";var f=100*t.available_bikes/t.bike_stands,l="#333333";f<=20?l="#2B00DD":f<=40?l="#5500BB":f<=60?l="#800099":f<=80?l="#AA0077":f<=120&&(l="#D50055");if(i!="circle"){var c={color:l,opacity:.6,weight:5,fillColor:"#000000",fillOpacity:.4};L.circle(t.position,50,c).addTo(e)}else L.mapbox.markerLayer({type:"Feature",geometry:{type:"Point",coordinates:[o,s]},properties:{title:"<h3>"+u+"</h3>",description:a,"marker-size":"small","marker-color":l,"marker-symbol":"bicycle"}}).addTo(e)}function n(e){var t=new Date(e),n=t.getHours(),r=t.getMinutes(),i=t.getSeconds(),s=n+"h:"+r+"m:"+i+"s:";return s}function r(e){var t=(new Date).getTime();t-=e;return n(t)}var e=L.mapbox.map("map","etiwiti.map-91mhirzp").setView([48.856,2.342],13);e.attributionControl.removeFrom(e);$.ajax({url:"https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris",type:"GET",crossDomain:!0,dataType:"jsonp",success:function(n){var r="",i=n,s=0,o=0;for(var u=0;u<i.length;u++){t(e,i[u],r);s+=i[u].available_bikes;o+=i[u].available_bike_stands}},error:function(){console.log("Fail load data API")}})});