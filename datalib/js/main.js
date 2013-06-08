$(function() {

    //////////////////////////////////
    /* MAP */
    //////////////////////////////////

    var map = L.mapbox.map('map', 'etiwiti.panam');
    map.attributionControl.removeFrom(map);

    //////////////////////////////////
    /* AJAX */
    //////////////////////////////////

    /* TEST ZONE */
        //http://kevinlarosa.fr:4000/?dateStart=1369573200000&dateEnd=1369591200000
        var now = moment();
        var start = moment().subtract('hours', 3);
        url = 'http://kevinlarosa.fr:4000/?dateStart='+start+'&dateEnd='+now;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                for(var i=0;i<data.length;i++){
                    var totalBikes = 0;
                    for(var y=0;y<data[i].stations.length;y++){
                        totalBikes += data[i].stations[y].available_bikes;
                    }
                    console.log(totalBikes);
                }
            },
            error: function() { console.log('Fail load data API'); }
        });
    /* TEST ZONE FIN*/

    var q = "select * from html where url='https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris'";
    jyql(q, function (err, data) {
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
    setInterval(function(){
        jyql(q, function(err, data){
            localStorage.data = data.query.results.body.p;
        });
    }, 9000);

    //////////////////////////////////
    /* TIMELINE */
    //////////////////////////////////

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
                    }, 10000);
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
                        x: time + i * 10000,
                        y: y
                    });
                }
                return data;
            })()
        }]
    });

    /* REAL TIME */
    $('#timeline nav ul li:nth-child(1)').on('click',function(){
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
                        }, 10000);
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
                            x: time + i * 10000,
                            y: y
                        });
                    }
                    return data;
                })()
            }]
        });
    });

    /* LAST 24h */
    $('#timeline nav ul li:nth-child(2)').on('click',function(){
        $('#graph').highcharts({
            chart: {
                type: 'spline',
                backgroundColor: 'transparent',
                height:'190',
                animation: Highcharts.svg, // don't animate in old IE
                events: {
                    click: function(e){
                        console.log('ALLO');
                    },
                    load: function() {

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
                            x: time + i * 10000,
                            y: y
                        });
                    }
                    return data;
                })()
            }]
        });
    });

    //////////////////////////////////
    /* Recherche Autocompletion */
    //////////////////////////////////

    var velib = JSON.parse(localStorage.data);
    var tab = [];
    for (var i=0 ; i<velib.length ; i++) {
        tab[i] = velib[i].name.slice(8).toLowerCase(1);
    }
    $('#search').typeahead({
      name: 'station',
      local: tab
    });

    //////////////////////////////////
    /* FUNCTION */
    //////////////////////////////////

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
                donutData[0].y = feature.properties.broken_stands;
                donutData[1].y = feature.properties.available_bike_stands;
                donutData[2].y = feature.properties.available_bikes;
                showDonut(donutData);
            });
        }
    }

    //////////////////////////////////
    /* DONUT */
    //////////////////////////////////

    var donutContainer = $('#donutContainer'),
        donutColors = ['#1b6d93','#64bee7','#8fceea','#d0eaf6'],
        donutCategories = ['stands endommagés','stands vides','vélos disponibles'],
        donutData = [{
            y: 0,
            color: donutColors[0],
            name: donutCategories[0],
            categories: [0]
        },
        {
            y: 0,
            color: donutColors[1],
            name: donutCategories[1],
            categories: [1]
        },
        {
            y: 0,
            color: donutColors[2],
            name: donutCategories[2],
            categories: [2]
        }];

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