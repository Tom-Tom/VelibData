$(function() {

    /* MAP */
    var map = L.mapbox.map('map', 'etiwiti.panam');
    map.attributionControl.removeFrom(map);

    /* AJAX */

    // $.ajax({
    //     url: 'https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris',
    //     type: 'GET',
    //     crossDomain:true,
    //     dataType:'jsonp',
    //     success: function(data) {
    //         var type = '';
    //         var velib = data;
    //         var totalBikes = 0;
    //         var totalStands = 0;
    //         for (var i=0 ; i<velib.length ; i++) {
    //             addMarkers(map,velib[i],type);
    //             totalBikes = totalBikes + velib[i].available_bikes;
    //             totalStands = totalStands + velib[i].available_bike_stands;
    //         }
    //     },
    //     error: function() { console.log('Fail load data API'); }
    // });
    // setInterval(function() {
    //     $.ajax({
    //         url: 'https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris',
    //         type: 'GET',
    //         crossDomain: true,
    //         dataType: 'jsonp',
    //         success: function(data) {
    //             localStorage.data = JSON.stringify(data);
    //         },
    //         error: function() { console.log('Fail load data API'); }
    //     });
    // }, 3000);


    var q = "select * from html where url='https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris'";
    jyql(q,function(err,data){
        //console.log(data.query.results.body.p);
        localStorage.data = data.query.results.body.p;
        var type = '';
        var velib = JSON.parse(localStorage.data);
        var totalBikes = 0;
        var totalStands = 0;
        for (var i=0 ; i<velib.length ; i++) {
            addMarkers(map,velib[i],type);
            totalBikes = totalBikes + velib[i].available_bikes;
            totalStands = totalStands + velib[i].available_bike_stands;
        }
    });


    /* TIMELINE */

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    //var chart;
    $('#graph').highcharts({
        chart: {
            type: 'spline',
            backgroundColor: 'transparent',
            height:'190',
            animation: Highcharts.svg, // don't animate in old IE
            events: {
                load: function() {
                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function() {
                        var velib = JSON.parse(localStorage.data);
                        //console.log(velib);
                        var totalBikes = 0;
                        var totalStands = 0;
                        for (var i=0 ; i<velib.length ; i++) {
                            totalBikes = totalBikes + velib[i].available_bikes;
                            totalStands = totalStands + velib[i].available_bike_stands;
                        }
                        var y = totalBikes;
                        //console.log(y);
                        var x = (new Date()).getTime(); // current time
                        series.addPoint([x, y], true, true);
                    }, 5000);
                }
            }
        },
        credits: {
            enabled: false
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            lineWidth:0,
            tickPixelInterval: 100,
            labels: {
                style: {
                    fontFamily: 'DINPro'
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            gridLineWidth: 0,
            labels:{
                enabled: false
            }
        },
        tooltip: {
            formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                    Highcharts.numberFormat(this.y, 2)+'<br/>le '+
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x);
            },
            style: {
                padding: 10,
                fontFamily: 'DINPro'
            },
            crosshairs: [{
                    width: 4,
                    color: '#1b6d93'
                }]
        },
        plotOptions: {
            series: {
                color: '#64bee7',
                marker: {
                    fillColor: '#edf5fb',
                    lineColor: '#64bee7',
                    lineWidth: 4,
                    states:{
                        hover:{
                            lineColor: '#1b6d93'
                        }
                    }
                }
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Nombre de velib\':',
            lineWidth: 6,
            marker: {
                radius: 9
            },
            data: (function() {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;
                var velib = JSON.parse(localStorage.data);
                var y = 0;
                for (i = 0 ; i<velib.length ; i++) {
                    y = y + velib[i].available_bikes;
                }
                for (i = -19; i <= 0; i++) {
                    data.push({
                        x: time + i * 5000,
                        y: y
                    });
                }
                return data;
            })()
        }]
    });

    $('#timeline nav ul:nth-child(1)').on('click',function(){
        console.log('ALLO');
    });


    /* FUNCTION */

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

    function addMarkers(map,velib,type){
        var lat = velib.position.lat,
            lng = velib.position.lng,
            name = velib.name.slice(7),
            broken_stands = velib.bike_stands - (velib.available_bike_stands + velib.available_bikes),
            text = "<strong>Address : </strong>"+velib.address;
        text=text+"<br/><strong>Available bike stands : </strong>"+velib.available_bike_stands;
        text=text+"<br/><strong>Available bikes : </strong>"+velib.available_bikes;
        text=text+"<br/><strong>Last update : </strong>"+formattedTime(velib.last_update);
        text=text+"("+diffTime(velib.last_update)+"sec ago)";
        var pourcent = 100 * velib.available_bikes / velib.bike_stands,
            color = "#333333";
        if(pourcent <= 20){
            color = "#2B00DD";
        } else if(pourcent <= 40){
            color = "#5500BB";
        } else if(pourcent <= 60){
            color = "#800099";
        } else if(pourcent <= 80){
            color = "#AA0077";
        } else if(pourcent <= 100){
            color = "#D50055";
        }
        if(type==="circle"){
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
                    title: name,
                    description: text,
                    'marker-size': 'small',
                    'marker-color': color,
                    'marker-symbol': 'bicycle',
                    available_bike_stands: velib.available_bike_stands,
                    available_bikes: velib.available_bikes,
                    broken_stands: broken_stands
                }
            }).addTo(map).on('click',function(e) {
                e.layer.unbindPopup();
                var feature = e.layer.feature;
                var donutData = [{
                    y: feature.properties.broken_stands,
                    color: donutColors[0],
                    name: donutCategories[0],
                    categories: [0]
                },
                {
                    y: feature.properties.available_bike_stands,
                    color: donutColors[1],
                    name: donutCategories[1],
                    categories: [1]
                },
                {
                    y: feature.properties.available_bikes,
                    color: donutColors[2],
                    name: donutCategories[2],
                    categories: [2]
                }];
                donutContainer.removeClass('no_opacity');
                showDonut(donutData);
            });
        }
    }


    /* DONUT */

    var donutContainer = $('#donutContainer'),
        donutColors = ['#1b6d93','#64bee7','#8fceea','#d0eaf6'],
        donutCategories = ['stands endommagés','stands vides','vélos disponibles'];

    function showDonut(donutData){
        var totalStands = donutData[0].y + donutData[1].y + donutData[2].y + ' stands';
        donutContainer.highcharts({
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            chart: {
                type: 'pie',
                backgroundColor: 'transparent'
            },
            title: {
                text: totalStands,
                verticalAlign: 'middle'
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    center: ['50%', '50%'],
                    animation: {
                        duration: 2000,
                        easing: 'swing'
                    }
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            series: [{
                data: donutData,
                size: '80%',
                innerSize: '70%',
                name: 'Total'
            }]
        });
    }
});



/* LOCAL STORAGE */

$(function() {
    var velib = JSON.parse(localStorage.data),
        tab = [];
    for (var i=0 ; i<velib.length ; i++) {
        tab[i] = velib[i].name.slice(8).toLowerCase(1);
    }
    $('#search').typeahead({
      name: 'station',
      local: tab
    });
});