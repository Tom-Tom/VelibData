$(function () {
    var colors = Highcharts.getOptions().colors;
    var colors = ['#1b6d93', '#64bee7', '#8fceea'],
        name = '',
        velibData = [
            {
                y: 4,
                color: colors[0],
                name: 'Stands endommagés',
                categories: ['stands endommagés']
            },
            {
                y: 36,
                color: colors[1],
                name: 'Stands disponibles',
                categories: ['stands disponibles']
            },
            {
                y: 30,
                color: colors[2],
                name: 'Vélos disponibles',
                categories: ['vélos disponibles']
            }
        ];

    // Create the chart
    $('#donutChartContainer').highcharts({
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
            data: velibData,
            size: '80%',
            innerSize: '60%',
            name: 'Total'
        }]
    });
});