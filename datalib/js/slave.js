$(function () {
    var
    donutInitDelay = 500,
    donutContainer = $('#donutContainer'),
    donutMainPercent = $('#donutMainPercent'),
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

    function showDonut(donutData){
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
                text: ''
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
                data: donutData,
                size: '80%',
                innerSize: '60%',
                name: 'Total'
            }]
        });
        donutMainPercent.removeClass('no_opacity');
        changeDonutChart(69);
    }

    function changeDonutPercent(nbStands){
        donutMainPercent
            .addClass('no_opacity')
            .text(nbStands+'%')
            .removeClass('no_opacity');
    }

    donutContainer.on('inview', function(){
        var $this = $(this);
        $this.removeClass('no_opacity').off('inview');
        setTimeout(showDonut(donutData), donutInitDelay);
    });
});