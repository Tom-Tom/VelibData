$(function () {
    var
    donutInitDelay = 500,
    donutContainer = $('#donutContainer'),
    donutAllStands = $('#donutAllStands'),
    donutColors = [
        '#1b6d93',
        '#64bee7',
        '#8fceea',
        '#d0eaf6'
    ],
    donutCategories = [
        'stands endommagés',
        'stands disponibles',
        'vélos disponibles'
    ],
    donutData = [
        {
            y: 4,
            color: donutColors[0],
            name: 'Stands endommagés',
            categories: [0]
        },
        {
            y: 36,
            color: donutColors[1],
            name: 'Stands disponibles',
            categories: [1]
        },
        {
            y: 30,
            color: donutColors[2],
            name: 'Vélos disponibles',
            categories: [2]
        }
    ];

    function showDonut(data){
        var totalStands = data[0].y + data[1].y + data[2].y + ' stands';
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
                align: 'center',
                verticalAlign: 'middle'
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    center: ['50%', '50%']
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            series: [{
                data: data,
                size: '80%',
                innerSize: '60%',
                name: 'Total'
            }]
        });
        /*donutAllStands.removeClass('no_opacity');
        changeDonut(69);*/
    }
    /*
    function changeDonutPercent(nbStands){
        donutAllStands
            .addClass('no_opacity')
            .text(nbStands+'%')
            .removeClass('no_opacity');
    }*/

    donutContainer.on('inview', function(){
        var $this = $(this);
        $this.removeClass('no_opacity').off('inview');
        var newDonutData = donutData;
        setTimeout(showDonut(newDonutData), donutInitDelay);
    });
});