$(function() {

    function beforeInit(){
        //////////////////////////////////
        /* AJAX */
        //////////////////////////////////

        /* TEST ZONE */
        var now = moment();
        var start = moment().subtract('days', 1);
        url = 'http://kevinlarosa.fr:4000/timeline?dateStart='+start+'&dateEnd='+now;
        // console.log(url);
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                localStorage.data1 = JSON.stringify(data);
                init();
                $('#loading_page .content').addClass('stop');
                $('#gate_bottom').addClass('open');
                $('#gate_top').addClass('open');
            },
            error: function() {
                beforeInit();
            }
        });
        /* TEST ZONE FIN*/
    }

    beforeInit();

    function init(){
        //////////////////////////////////
        /* MAP */
        //////////////////////////////////
        
        var map = L.mapbox.map('map', 'etiwiti.panam');
        map.attributionControl.removeFrom(map);

        var q = "select * from html where url='https://api.jcdecaux.com/vls/v1/stations?apiKey=a529d3371c450b3ab44a9281345bcb27e8f47868&contract=Paris'";
        jyql(q, function (err, data) {
            localStorage.data = data.query.results.body.p;
            var velib = JSON.parse(localStorage.data);
            for (var i=0 ; i<velib.length ; i++) {
                addMarkers(map,velib[i]);
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

        $('#timeline nav ul li').on('click', function(){
            $('#timeline nav ul li.active').removeClass('active');
            $(this).addClass('active');
        });

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        function realtime(){
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
        }

        realtime();

        /* REAL TIME */
        $('#timeline nav ul li:nth-child(1)').on('click',function(){
            realtime();
        });

        /* LAST 24h */
        $('#timeline nav ul li:nth-child(2)').on('click',function(){
            $('#graph').highcharts({
                chart: {
                    type: 'spline',
                    backgroundColor: 'transparent',
                    height:'190',
                    animation: Highcharts.svg
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
                        allowPointSelect:true,
                        color: '#64bee7',
                        marker: {
                            fillColor: '#edf5fb',
                            lineColor: '#64bee7',
                            lineWidth: 4,
                            states:{
                                hover:{
                                    lineColor: '#1b6d93'
                                },
                                select:{
                                    lineColor: '#1b6d93',
                                    lineWidth: 4
                                }
                            }
                        },
                        events:{
                            click: function(e){
                                console.log(e.point.x);
                                url = 'http://kevinlarosa.fr:4000/?dateStart='+(e.point.x-1)+'&dateEnd='+(e.point.x+1);
                                $.ajax({
                                    url: url,
                                    type: 'GET',
                                    dataType: 'json',
                                    success: function(data) {
                                        $(".leaflet-marker-pane img").remove();
                                        map.markerLayer.clearLayers();
                                        for (var i=0 ; i<data[0].stations.length ; i++) {
                                            addMarkers(map,data[0].stations[i]);
                                        }
                                    },
                                    error: function() {
                                        console.log('ERROR');
                                    }
                                });
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
                        var data = [];
                        var velib = JSON.parse(localStorage.data1);
                        for ( var i = 0; i < 24; i++) {
                            data.push({
                                x: Date.parse(velib[i].timestamp),
                                y: velib[i].velib
                            });
                        }
                        return data;
                    })()
                }]
            });
        });

        /* LAST 48h */
        $('#timeline nav ul li:nth-child(3)').on('click',function(){
            
        });

        //////////////////////////////////
        /* Recherche Autocompletion */
        //////////////////////////////////

        // crée le tableau de data pour les recherches
        var velib = JSON.parse(localStorage.data);
        var tab = [];
        for(var i=0 ; i<velib.length ; i++) {
            tab[i] = {
                value: velib[i].name.slice(8).toLowerCase(1),
                id: velib[i].number
            };
        }

        // affiche les propositions de recherche
        $('#search').typeahead({
            name: 'station',
            local: tab
        });

        // au click d'une proposition de recherche, 
        // cherche dans le localStorage les data de la station et
        // affiche le donut avec les data
        $('#search').on('typeahead:selected', function(e, elem){
            for(i=0; i<velib.length; i++){
                if(velib[i].number === elem.id){
                    var stationData = velib[i],
                        broken_stands = stationData.bike_stands - (stationData.available_bike_stands + stationData.available_bikes);
                    donutData[0].y = broken_stands;
                    donutData[1].y = stationData.available_bike_stands;
                    donutData[2].y = stationData.available_bikes;
                    donutInfo.name = stationData.name.slice(8);
                    donutInfo.address = stationData.address;
                    showDonut(donutData, donutInfo);
                    i = velib.length;
                }
            }
        });

        //////////////////////////////////
        /* FUNCTIONS */
        //////////////////////////////////

        function formattedTime(timestamp){
            var date = new Date(timestamp),
                hours = date.getHours(),
                minutes = date.getMinutes(),
                seconds = date.getSeconds(),
                time = hours + 'h:' + minutes + 'm:' + seconds+ 's:';
            return time;
        }

        function diffTime(timestamp){
            var nowDate = new Date().getTime();
            nowDate -= timestamp;
            return formattedTime(nowDate);
        }

        function addMarkers(map,velib){
            var lat = velib.position.lat,
                lng = velib.position.lng,
                broken_stands = velib.bike_stands - (velib.available_bike_stands + velib.available_bikes),
                text = "<strong>Address : </strong>"+velib.address;
            text+="<br/><strong>Available bike stands : </strong>"+velib.available_bike_stands;
            text+="<br/><strong>Available bikes : </strong>"+velib.available_bikes;
            text+="<br/><strong>Last update : </strong>"+formattedTime(velib.last_update);
            text+="("+diffTime(velib.last_update)+"sec ago)";
                var pourcent = 100 * velib.available_bikes / velib.bike_stands;
                if(pourcent <= 25){
                    pin = "img/pin_rouge.svg";
                } else if(pourcent <= 50){
                    pin = "img/pin_orange.svg";
                } else if(pourcent <= 75){
                    pin = "img/pin_jaune.svg";
                } else {
                    pin = "img/pin_vert.svg";
                }
                if((lat===null)||(lng===null)){
                    return false;
                }
                L.marker([lat, lng],{
                    icon: L.icon({
                        iconUrl: pin,
                        iconSize:     [20, 20], // size of the icon
                        iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
                        popupAnchor:  [0, -10],  // point from which the popup should open relative to the iconAnchor
                        available_bike_stands: velib.available_bike_stands,
                        available_bikes: velib.available_bikes,
                        broken_stands: broken_stands
                    })
                }).addTo(map).on('click',function(e){
                    console.log(e);
                    var feature = e.target.options.icon.options;
                    donutData[0].y = feature.broken_stands;
                    donutData[1].y = feature.available_bike_stands;
                    donutData[2].y = feature.available_bikes;
                    donutInfo.name = velib.name.slice(8);
                    donutInfo.address = velib.address;
                    showDonut(donutData, donutInfo);
                });
        }

        //////////////////////////////////
        /* DONUT */
        //////////////////////////////////

        /* CACHE LE DONUT AU CLICK SUR MAP */
        map.on('click', function(){
            $('body').removeClass('screenSplit');
            setTimeout(function(){map.invalidateSize();}, 500);
        });

        /* CONFIGURE LE DONUT */
        var donutContainer = $('#donutContainer'),
            donutInfoName = $('#titreStation'),
            donutInfoAddress = $('#soustitreStation'),
            donutColors = ['#1b6d93','#64bee7','#8fceea','#d0eaf6'],
            donutCategories = ['stands endommagés','stands vides','vélos disponibles'],
            donutInfo = {
                name: '',
                address: ''
            },
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

            // timeline - animation du donut
            var tlDonut = new TimelineLite();
            tlDonut.from(donutInfoName, 1, {left: '-9999px'})
            .from(donutInfoAddress, 0.5, {left: '9999px'}, '-=0.25')
            .from(donutContainer, 1, {scale: 0}, '-=0.25');

        /* AFFICHE LE DONUT AVEC LES DONNÉES PASSÉES EN PARAMÈTRE */
        function showDonut(donutData, donutInfo){
            // calcule le titre du donut avec le nombres de stands total
            var donutTitle = donutData[0].y + donutData[1].y + donutData[2].y + ' stands';
            // affiche les infos du donut Nom de station et Adresse
            donutInfoName.text(donutInfo.name);
            donutInfoAddress.text(donutInfo.address);
            // affiche le donut dans son container
            donutContainer.highcharts({
                chart: {
                    type: 'pie',
                    backgroundColor: 'transparent',
                    style: {
                        fontFamily: 'DINPro',
                        fonSize: '1em'
                    }
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                labels: {
                    items: [{
                        style: {
                            fontFamily: 'DINPro'
                        }
                    }],
                    style: {
                        fontFamily: 'DINPro'
                    }
                },
                legend: {
                    style: {
                        fontFamily: 'DINPro'
                    }
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        center: ['50%', '50%'],
                        animation: {
                            duration: 2000,
                            easing: 'swing'
                        },
                        dataLabels: {
                            style: {
                                fontFamily: 'DINPro',
                                fontSize: '1.5em'
                            }
                        },
                        borderColor: '#d0eaf6',
                        borderWidth: 4,
                        startAngle: Math.floor(Math.random()*(360-1)+0)
                    }
                },
                series: [{
                    data: donutData,
                    size: '75%',
                    innerSize: '65%',
                    name: 'Total'
                }],
                title: {
                    text: donutTitle,
                    verticalAlign: 'middle',
                    style: {
                        fontFamily:'DINPro',
                        fontSize:'1.5em'
                    }
                },
                tooltip: {
                    hideDelay: 100,
                    headerFormat: '',
                    pointFormat: '<span style="color:{point.color};font-weight:bold;font-size:1.2em;">{point.y}</span>',
                    footerFormat: '',
                    style: {
                        fontFamily: 'DINPro'
                    }
                }
            });
            // split de l'écran en deux
            $('body').addClass('screenSplit');
            // affiche le donut en relançant la timeline - animation
            tlDonut.restart();
            // re-centre la map à la fin de la timeline
            setTimeout(function(){map.invalidateSize();}, 500);
        }

        function setDonutMapHeight(){
            var windowHeight = $(this).height(),
                titleHeight = $('#title').height(),
                timelineHeight = $('#timeline').height(),
                theDonutMapHeight = windowHeight - (titleHeight + timelineHeight);
            $('#informations, #map_container').css('height', theDonutMapHeight+'px');
            map.invalidateSize();
        }

        setDonutMapHeight();

        $(window).resize(function(){
            setDonutMapHeight();
        });
    }
});