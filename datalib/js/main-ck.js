$(function(){function a(e){var t=new Date(e),n=t.getHours(),r=t.getMinutes(),i=t.getSeconds(),s=n+"h:"+r+"m:"+i+"s:";return s}function f(e){var t=(new Date).getTime();t-=e;return a(t)}function l(e,t){var n=t.position.lat,r=t.position.lng,i=t.name.slice(7),s=t.bike_stands-(t.available_bike_stands+t.available_bikes),o="<strong>Address : </strong>"+t.address;o=o+"<br/><strong>Available bike stands : </strong>"+t.available_bike_stands;o=o+"<br/><strong>Available bikes : </strong>"+t.available_bikes;o=o+"<br/><strong>Last update : </strong>"+a(t.last_update);o=o+"("+f(t.last_update)+"sec ago)";var u=100*t.available_bikes/t.bike_stands;u<=25?pin="img/pin_rouge.svg":u<=50?pin="img/pin_orange.svg":u<=75?pin="img/pin_jaune.svg":pin="img/pin_vert.svg";L.marker([n,r],{icon:L.icon({iconUrl:pin,iconSize:[20,20],iconAnchor:[10,10],popupAnchor:[0,-10],available_bike_stands:t.available_bike_stands,available_bikes:t.available_bikes,broken_stands:s})}).addTo(e).on("click",function(e){var n=e.target.options.icon.options;y[0].y=n.broken_stands;y[1].y=n.available_bike_stands;y[2].y=n.available_bikes;g.name=t.name;g.address=t.address;w(y,g)})}function w(t,n){var r=t[0].y+t[1].y+t[2].y+" stands";p.text(n.name.slice(8));d.text(n.address);h.highcharts({chart:{type:"pie",backgroundColor:"transparent",style:{fontFamily:"DINPro",fonSize:"1em"}},credits:{enabled:!1},exporting:{enabled:!1},labels:{items:[{style:{fontFamily:"DINPro"}}],style:{fontFamily:"DINPro"}},legend:{style:{fontFamily:"DINPro"}},plotOptions:{pie:{shadow:!1,center:["50%","50%"],animation:{duration:2e3,easing:"swing"},dataLabels:{style:{fontFamily:"DINPro",fontSize:"1.5em"}}}},series:[{data:t,size:"75%",innerSize:"70%",name:"Total"}],title:{text:r,verticalAlign:"middle",style:{fontFamily:"DINPro",fontSize:"2em"}},tooltip:{hideDelay:100,headerFormat:"",pointFormat:'<span style="color:{point.color};font-weight:bold;font-size:1.2em;">{point.y}</span>',footerFormat:"",style:{fontFamily:"DINPro"}}});$("body").addClass("screenSplit");b.restart();setTimeout(function(){e.invalidateSize()},500)}var e=L.mapbox.map("map","etiwiti.panam"),t=$("#map_container");e.attributionControl.removeFrom(e);thedata={};var n=moment(),r=moment().subtract("hours",24);url="http://kevinlarosa.fr:4000/?dateStart="+r+"&dateEnd="+n;$.ajax({url:url,type:"GET",dataType:"json",success:function(e){thedata=JSON.stringify(e);console.log("ok")},error:function(){console.log("Fail load data API")}});var i="select * from html where url='https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris'";jyql(i,function(t,n){localStorage.data=n.query.results.body.p;var r=JSON.parse(localStorage.data),i=0,s=0;for(var o=0;o<r.length;o++){l(e,r[o]);i+=r[o].available_bikes;s+=r[o].available_bike_stands}});setInterval(function(){jyql(i,function(e,t){localStorage.data=t.query.results.body.p})},9e3);$("#timeline nav ul li").on("click",function(){$("#timeline nav ul li.active").removeClass("active");$(this).addClass("active")});Highcharts.setOptions({global:{useUTC:!1}});$("#graph").highcharts({chart:{type:"spline",backgroundColor:"transparent",height:"190",animation:Highcharts.svg,events:{load:function(){var e=this.series[0];setInterval(function(){var t=JSON.parse(localStorage.data),n=0,r=0;for(var i=0;i<t.length;i++){n+=t[i].available_bikes;r+=t[i].available_bike_stands}var s=n,o=(new Date).getTime();e.addPoint([o,s],!0,!0)},1e4)}}},credits:{enabled:!1},title:{text:""},xAxis:{type:"datetime",lineWidth:0,tickPixelInterval:100,labels:{style:{fontFamily:"DINPro"}}},yAxis:{title:{text:""},gridLineWidth:0,labels:{enabled:!1}},tooltip:{formatter:function(){return"<b>"+this.series.name+"</b><br/>"+Highcharts.numberFormat(this.y,2)+"<br/>le "+Highcharts.dateFormat("%Y-%m-%d %H:%M:%S",this.x)},style:{padding:10,fontFamily:"DINPro"},crosshairs:[{width:4,color:"#1b6d93"}]},plotOptions:{series:{color:"#64bee7",marker:{fillColor:"#edf5fb",lineColor:"#64bee7",lineWidth:4,states:{hover:{lineColor:"#1b6d93"}}}}},legend:{enabled:!1},exporting:{enabled:!1},series:[{name:"Nombre de velib':",lineWidth:6,marker:{radius:9},data:function(){var e=[],t=(new Date).getTime(),n,r=JSON.parse(localStorage.data),i=0;for(n=0;n<r.length;n++)i+=r[n].available_bikes;for(n=-19;n<=0;n++)e.push({x:t+n*1e4,y:i});return e}()}]});$("#timeline nav ul li:nth-child(1)").on("click",function(){$("#graph").highcharts({chart:{type:"spline",backgroundColor:"transparent",height:"190",animation:Highcharts.svg,events:{load:function(){var e=this.series[0];setInterval(function(){var t=JSON.parse(localStorage.data),n=0,r=0;for(var i=0;i<t.length;i++){n+=t[i].available_bikes;r+=t[i].available_bike_stands}var s=n,o=(new Date).getTime();e.addPoint([o,s],!0,!0)},1e4)}}},credits:{enabled:!1},title:{text:""},xAxis:{type:"datetime",lineWidth:0,tickPixelInterval:100,labels:{style:{fontFamily:"DINPro"}}},yAxis:{title:{text:""},gridLineWidth:0,labels:{enabled:!1}},tooltip:{formatter:function(){return"<b>"+this.series.name+"</b><br/>"+Highcharts.numberFormat(this.y,2)+"<br/>le "+Highcharts.dateFormat("%Y-%m-%d %H:%M:%S",this.x)},style:{padding:10,fontFamily:"DINPro"},crosshairs:[{width:4,color:"#1b6d93"}]},plotOptions:{series:{color:"#64bee7",marker:{fillColor:"#edf5fb",lineColor:"#64bee7",lineWidth:4,states:{hover:{lineColor:"#1b6d93"}}}}},legend:{enabled:!1},exporting:{enabled:!1},series:[{name:"Nombre de velib':",lineWidth:6,marker:{radius:9},data:function(){var e=[],t=(new Date).getTime(),n,r=JSON.parse(localStorage.data),i=0;for(n=0;n<r.length;n++)i+=r[n].available_bikes;for(n=-19;n<=0;n++)e.push({x:t+n*1e4,y:i});return e}()}]})});$("#timeline nav ul li:nth-child(2)").on("click",function(){$("#graph").highcharts({chart:{type:"spline",backgroundColor:"transparent",height:"190",animation:Highcharts.svg},credits:{enabled:!1},title:{text:""},xAxis:{lineWidth:0,tickPixelInterval:100,labels:{style:{fontFamily:"DINPro"}}},yAxis:{title:{text:""},gridLineWidth:0,labels:{enabled:!1}},tooltip:{formatter:function(){},style:{padding:10,fontFamily:"DINPro"},crosshairs:[{width:4,color:"#1b6d93"}]},plotOptions:{series:{color:"#64bee7",marker:{fillColor:"#edf5fb",lineColor:"#64bee7",lineWidth:4,states:{hover:{lineColor:"#1b6d93"}}},events:{click:function(e){console.log(e.point)}}}},legend:{enabled:!1},exporting:{enabled:!1},series:[{name:"Nombre de velib':",lineWidth:6,marker:{radius:9},data:function(){var e=[],t=(new Date).getTime(),n,r=JSON.parse(thedata);console.log(thedata);for(n=0;n<r.length;n++){var i=0;for(var s=0;s<r[n].stations.length;s++)i+=r[n].stations[s].available_bikes;console.log(Date.parse(r[n].timestamp)+" AVEC "+i);e.push({x:Date.parse(r[n].timestamp),y:i})}console.log(e);return e}()}]})});var s=JSON.parse(localStorage.data),o=[];for(var u=0;u<s.length;u++)o[u]={value:s[u].name.slice(8).toLowerCase(1),id:s[u].number};$("#search").typeahead({name:"station",local:o});$("#search").on("typeahead:selected",function(e,t){for(u=0;u<s.length;u++)if(s[u].number===t.id){var n=s[u],r=n.bike_stands-(n.available_bike_stands+n.available_bikes);y[0].y=r;y[1].y=n.available_bike_stands;y[2].y=n.available_bikes;g.name=n.name;g.address=n.address;w(y,g);u=s.length}});e.on("click",function(){$("body").removeClass("screenSplit");setTimeout(function(){e.invalidateSize()},500)});var c=$("#informations"),h=$("#donutContainer"),p=$("#titreStation"),d=$("#soustitreStation"),v=["#1b6d93","#64bee7","#8fceea","#d0eaf6"],m=["stands endommagés","stands vides","vélos disponibles"],g={name:"",address:""},y=[{y:0,color:v[0],name:m[0],categories:[0]},{y:0,color:v[1],name:m[1],categories:[1]},{y:0,color:v[2],name:m[2],categories:[2]}],b=new TimelineLite;b.from(p,1,{left:"-9999px"}).from(d,.5,{left:"9999px"},"-=0.25").from(h,1,{scale:0},"-=0.25")});