$(function(){function o(e){t.highcharts({exporting:{enabled:!1},credits:{enabled:!1},chart:{type:"pie",backgroundColor:"transparent"},title:{text:""},plotOptions:{pie:{shadow:!1,center:["50%","50%"]}},tooltip:{valueSuffix:""},series:[{data:e,size:"80%",innerSize:"60%",name:"Total"}]});n.removeClass("no_opacity");changeDonutChart(69)}function u(e){n.addClass("no_opacity").text(e+"%").removeClass("no_opacity")}var e=500,t=$("#donutContainer"),n=$("#donutMainPercent"),r=["#1b6d93","#64bee7","#8fceea","#d0eaf6"],i=["stands endommagés","stands disponibles","vélos disponibles"],s=[{y:4,color:r[0],name:"Stands endommagés",categories:[0]},{y:36,color:r[1],name:"Stands disponibles",categories:[1]},{y:30,color:r[2],name:"Vélos disponibles",categories:[2]}];t.on("inview",function(){var t=$(this);t.removeClass("no_opacity").off("inview");setTimeout(o(s),e)})});