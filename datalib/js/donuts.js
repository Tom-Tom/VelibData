/*****************
    Chart.js
*****************/

$(window).load(function(){
    var donutChartData = [
        {
            title: '4%',
            value: 4,
            color:'#1b6d93'
        },
        {
            title: '36%',
            value : 36,
            color : '#64bee7'
        },
        {
            title: '30%',
            value : 30,
            color : '#8fceea'
        }
    ];
    // pas nécessaire
    //var globalGraphSettings = { Modernizr.canva };

    var globalGraphSettings = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke : true,
        //String - The colour of each segment stroke
        segmentStrokeColor : '#d0eaf6',
        //Number - The width of each segment stroke
        segmentStrokeWidth : 5,
        //The percentage of the chart that we cut out of the middle.
        percentageInnerCutout : 70,
        //Boolean - Whether we should animate the chart 
        animation : true,
        //Number - Amount of animation steps
        animationSteps : 100,
        //String - Animation easing effect
        animationEasing : 'easeOutBounce',
        //Boolean - Whether we animate the rotation of the donut
        animateRotate : true,
        //Boolean - Whether we animate scaling the donut from the centre
        animateScale : false,
        //Function - Will fire on animation completion.
        onAnimationComplete : null
    };
    var graphInitDelay = 500;
    var divNbStands = $('#donutNbStands');

    function showDonutChart(){
        var ctx = document.getElementById('donutChartCanvas').getContext('2d');
        new Chart(ctx).Doughnut(donutChartData,globalGraphSettings);
        $('#donutNbStands').removeClass('no_opacity');
        changeDonutChart(69);
    }

    $('#donutChartCanvas').on('inview', function(){
        var $this = $(this);
        $this.removeClass('no_opacity').off('inview');
        setTimeout(showDonutChart,graphInitDelay);
    });

    function changeDonutChart(nbStands){
        divNbStands.addClass('no_opacity');
        divNbStands.text(nbStands+'%');
        divNbStands.removeClass('no_opacity');
    }
});
