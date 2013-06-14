$(function(){function e(){var e=moment(),t=moment().subtract("hours",38);url="http://kevinlarosa.fr:4000/timeline?dateStart="+t+"&dateEnd="+e;$.ajax({url:url,type:"GET",dataType:"json",success:function(e){localStorage.data1=JSON.stringify(e);r();$("#loader").remove();setTimeout(function(){$("#gate_top , #gate_bottom, #loading_header").addClass("open")},500)},error:function(){}})}function r(){function n(){$(".leaflet-marker-pane img").remove();var t=JSON.parse(localStorage.data);for(var n=0;n<t.length;n++)a(e,t[n]);$("#graph").highcharts({chart:{type:"spline",backgroundColor:"transparent",height:"190",animation:Highcharts.svg,events:{load:function(){var e=this.series[0];setInterval(function(){var t=JSON.parse(localStorage.data),n=0,r=0;for(var i=0;i<t.length;i++){n+=t[i].available_bikes;r+=t[i].available_bike_stands}var s=n,o=(new Date).getTime();e.addPoint([o,s],!0,!0)},1e4)}}},credits:{enabled:!1},title:{text:""},xAxis:{type:"datetime",lineWidth:0,tickPixelInterval:100,labels:{style:{fontFamily:"DINPro"}}},yAxis:{title:{text:""},gridLineWidth:0,labels:{enabled:!1}},tooltip:{formatter:function(){return"<b>"+this.series.name+"</b><br/>"+Highcharts.numberFormat(this.y,2)+"<br/>le "+Highcharts.dateFormat("%Y-%m-%d %H:%M:%S",this.x)},style:{padding:10,fontFamily:"DINPro"},crosshairs:[{width:4,color:"#1b6d93"}]},plotOptions:{series:{color:"#64bee7",marker:{fillColor:"#edf5fb",lineColor:"#64bee7",lineWidth:4,states:{hover:{lineColor:"#1b6d93"}}}}},legend:{enabled:!1},exporting:{enabled:!1},series:[{name:"Nombre de velib':",lineWidth:6,marker:{radius:9},data:function(){var e=[],t=(new Date).getTime(),n,r=JSON.parse(localStorage.data),i=0;for(n=0;n<r.length;n++)i+=r[n].available_bikes;for(n=-19;n<=0;n++)e.push({x:t+n*1e4,y:i});return e}()}]})}function o(e){var t=new Date(e),n=t.getHours(),r=t.getMinutes(),i=t.getSeconds(),s=n+"h:"+r+"m:"+i+"s:";return s}function u(e){var t=(new Date).getTime();t-=e;return o(t)}function a(e,t){var n=t.position.lat,r=t.position.lng,i=t.bike_stands-(t.available_bike_stands+t.available_bikes),s=100*t.available_bikes/t.bike_stands;s<=20?pin="img/bleu_1.svg":s<=40?pin="img/bleu_2.svg":s<=60?pin="img/bleu_3.svg":s<=80?pin="img/bleu_4.svg":pin="img/bleu_5.svg";if(n===null||r===null)return!1;if(t.available_bikes===0&&t.available_bike_stands===null)return!1;L.marker([n,r],{icon:L.icon({iconUrl:pin,iconSize:[20,20],iconAnchor:[10,10],popupAnchor:[0,-10],available_bike_stands:t.available_bike_stands,available_bikes:t.available_bikes,broken_stands:i})}).addTo(e).on("click",function(e){var n=e.target.options.icon.options;v[0].y=n.broken_stands;v[1].y=n.available_bike_stands;v[2].y=n.available_bikes;d.name=t.name.slice(8);d.address=t.address;g(v,d)})}function g(t,n){var r=t[0].y+t[1].y+t[2].y+" stands";l.text(n.name);c.text(n.address);f.highcharts({chart:{type:"pie",backgroundColor:"transparent",style:{fontFamily:"DINPro",fonSize:"1em"}},credits:{enabled:!1},exporting:{enabled:!1},labels:{items:[{style:{fontFamily:"DINPro"}}],style:{fontFamily:"DINPro"}},legend:{style:{fontFamily:"DINPro"}},plotOptions:{pie:{shadow:!1,center:["50%","50%"],animation:{duration:2e3,easing:"swing"},dataLabels:{style:{fontFamily:"DINPro",fontSize:"1.5em"}},borderColor:"#d0eaf6",borderWidth:4,startAngle:Math.floor(Math.random()*359+0)}},series:[{data:t,size:"75%",innerSize:"65%",name:"Total"}],title:{text:r,verticalAlign:"middle",style:{fontFamily:"DINPro",fontSize:"1.5em"}},tooltip:{hideDelay:100,headerFormat:"",pointFormat:'<span style="color:{point.color};font-weight:bold;font-size:1.2em;">{point.y}</span>',footerFormat:"",style:{fontFamily:"DINPro"}}});$("body").addClass("screenSplit");m.restart();setTimeout(function(){e.invalidateSize()},500)}var e=L.mapbox.map("map","heymath.velib");e.attributionControl.removeFrom(e);var t="select * from html where url='https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris'";jyql(t,function(t,n){localStorage.data=n.query.results.body.p;var r=JSON.parse(localStorage.data);for(var i=0;i<r.length;i++)a(e,r[i])});setInterval(function(){jyql(t,function(e,t){localStorage.data=t.query.results.body.p})},9e3);$("#timeline nav ul li").on("click",function(){$("#timeline nav ul li.active").removeClass("active");$(this).addClass("active")});Highcharts.setOptions({global:{useUTC:!1}});n();$("#timeline nav ul li:nth-child(1)").on("click",function(){n()});$("#timeline nav ul li:nth-child(2)").on("click",function(){$("#graph").highcharts({chart:{type:"spline",backgroundColor:"transparent",height:"190",animation:Highcharts.svg},credits:{enabled:!1},title:{text:""},xAxis:{type:"datetime",lineWidth:0,tickPixelInterval:100,labels:{style:{fontFamily:"DINPro"}}},yAxis:{title:{text:""},gridLineWidth:0,labels:{enabled:!1}},tooltip:{formatter:function(){return"<b>"+this.series.name+"</b><br/>"+Highcharts.numberFormat(this.y,2)+"<br/>le "+Highcharts.dateFormat("%Y-%m-%d %H:%M:%S",this.x+864e5)},style:{padding:10,fontFamily:"DINPro"},crosshairs:[{width:4,color:"#1b6d93"}]},plotOptions:{series:{allowPointSelect:!0,color:"#64bee7",marker:{fillColor:"#edf5fb",lineColor:"#64bee7",lineWidth:4,states:{hover:{lineColor:"#1b6d93"},select:{lineColor:"#1b6d93",lineWidth:4}}},events:{click:function(t){url="http://kevinlarosa.fr:4000/?dateStart="+(t.point.x-1)+"&dateEnd="+(t.point.x+1);$.ajax({url:url,type:"GET",dataType:"json",success:function(t){$(".leaflet-marker-pane img").remove();for(var n=0;n<t[0].stations.length;n++)a(e,t[0].stations[n])},error:function(){console.log("ERROR")}})}}}},legend:{enabled:!1},exporting:{enabled:!1},series:[{name:"Nombre de velib':",lineWidth:6,marker:{radius:9},data:function(){var e=[],t=JSON.parse(localStorage.data1);for(var n=0;n<24;n++)e.push({x:Date.parse(t[n].timestamp),y:t[n].velib});return e}()}]})});$("#timeline nav ul li:nth-child(3)").on("click",function(){$("#graph").highcharts({chart:{type:"spline",backgroundColor:"transparent",height:"190",animation:Highcharts.svg},credits:{enabled:!1},title:{text:""},xAxis:{type:"datetime",lineWidth:0,tickPixelInterval:100,labels:{style:{fontFamily:"DINPro"}}},yAxis:{title:{text:""},gridLineWidth:0,labels:{enabled:!1}},tooltip:{formatter:function(){return"<b>"+this.series.name+"</b><br/>"+Highcharts.numberFormat(this.y,2)+"<br/>le "+Highcharts.dateFormat("%Y-%m-%d %H:%M:%S",this.x+864e5)},style:{padding:10,fontFamily:"DINPro"},crosshairs:[{width:4,color:"#1b6d93"}]},plotOptions:{series:{allowPointSelect:!0,color:"#64bee7",marker:{fillColor:"#edf5fb",lineColor:"#64bee7",lineWidth:4,states:{hover:{lineColor:"#1b6d93"},select:{lineColor:"#1b6d93",lineWidth:4}}},events:{click:function(t){url="http://kevinlarosa.fr:4000/?dateStart="+(t.point.x-1)+"&dateEnd="+(t.point.x+1);$.ajax({url:url,type:"GET",dataType:"json",success:function(t){$(".leaflet-marker-pane img").remove();for(var n=0;n<t[0].stations.length;n++)a(e,t[0].stations[n])},error:function(){console.log("ERROR")}})}}}},legend:{enabled:!1},exporting:{enabled:!1},series:[{name:"Nombre de velib':",lineWidth:6,marker:{radius:9},data:function(){var e=[],t=JSON.parse(localStorage.data7);for(var n=0;n<21;n++)e.push({x:Date.parse(t[n].timestamp),y:t[n].velib});return e}()}]})});$("#timeline nav ul li:nth-child(4)").on("click",function(){$("#graph").highcharts({chart:{type:"spline",backgroundColor:"transparent",height:"190",animation:Highcharts.svg},credits:{enabled:!1},title:{text:""},xAxis:{type:"datetime",lineWidth:0,tickPixelInterval:100,labels:{style:{fontFamily:"DINPro"}}},yAxis:{title:{text:""},gridLineWidth:0,labels:{enabled:!1}},tooltip:{formatter:function(){return"<b>"+this.series.name+"</b><br/>"+Highcharts.numberFormat(this.y,2)+"<br/>le "+Highcharts.dateFormat("%Y-%m-%d %H:%M:%S",this.x+864e5)},style:{padding:10,fontFamily:"DINPro"},crosshairs:[{width:4,color:"#1b6d93"}]},plotOptions:{series:{allowPointSelect:!0,color:"#64bee7",marker:{fillColor:"#edf5fb",lineColor:"#64bee7",lineWidth:4,states:{hover:{lineColor:"#1b6d93"},select:{lineColor:"#1b6d93",lineWidth:4}}},events:{click:function(t){url="http://kevinlarosa.fr:4000/?dateStart="+(t.point.x-2e3)+"&dateEnd="+(t.point.x+2e3);$.ajax({url:url,type:"GET",dataType:"json",success:function(t){$(".leaflet-marker-pane img").remove();for(var n=0;n<t[0].stations.length;n++)a(e,t[0].stations[n])},error:function(){console.log("ERROR")}})}}}},legend:{enabled:!1},exporting:{enabled:!1},series:[{name:"Nombre de velib':",lineWidth:6,marker:{radius:9},data:function(){var e=[],t=JSON.parse(localStorage.data30);for(var n=0;n<30;n++)e.push({x:Date.parse(t[n].timestamp),y:t[n].velib});return e}()}]})});var r=JSON.parse(localStorage.data),i=[];for(var s=0;s<r.length;s++)i[s]={value:r[s].name.slice(8).toLowerCase(1),id:r[s].number};$("#search").typeahead({name:"station",local:i});$("#search").on("typeahead:selected",function(e,t){for(s=0;s<r.length;s++)if(r[s].number===t.id){var n=r[s],i=n.bike_stands-(n.available_bike_stands+n.available_bikes);v[0].y=i;v[1].y=n.available_bike_stands;v[2].y=n.available_bikes;d.name=n.name.slice(8);d.address=n.address;g(v,d);s=r.length}});e.on("click",function(){$("body").removeClass("screenSplit");setTimeout(function(){e.invalidateSize()},500)});var f=$("#donutContainer"),l=$("#titreStation"),c=$("#soustitreStation"),h=["#1b6d93","#64bee7","#8fceea","#d0eaf6"],p=["stands endommagés","stands vides","vélos disponibles"],d={name:"",address:""},v=[{y:0,color:h[0],name:p[0],categories:[0]},{y:0,color:h[1],name:p[1],categories:[1]},{y:0,color:h[2],name:p[2],categories:[2]}],m=new TimelineLite;m.from(l,.5,{left:"-9999px"}).from(c,.5,{left:"9999px"},"-=0.25").from(f,1,{scale:0},"-=0.25")}e();var t=moment(),n=moment().subtract("days",7);url="http://kevinlarosa.fr:4000/timeline7?dateStart="+n+"&dateEnd="+t;$.ajax({url:url,type:"GET",dataType:"json",success:function(e){localStorage.data7=JSON.stringify(e)},error:function(){e()}});var n=moment().subtract("days",14);url="http://kevinlarosa.fr:4000/timeline30?dateStart="+n+"&dateEnd="+t;$.ajax({url:url,type:"GET",dataType:"json",success:function(e){localStorage.data30=JSON.stringify(e)},error:function(){e()}})});