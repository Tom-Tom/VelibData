/*****************
    Chart.js
*****************/

$(window).load(function(){
    var doughnutChartData = [
        {
            value: 4,
            color:"#1b6d93"
        },
        {
            value : 36,
            color : "#64bee7"
        },
        {
            value : 30,
            color : "#8fceea"
        }
    ];
    // pas nécessaire
    //var globalGraphSettings = { Modernizr.canva };

    var globalGraphSettings = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke : true,
        //String - The colour of each segment stroke
        segmentStrokeColor : "#d0eaf6",
        //Number - The width of each segment stroke
        segmentStrokeWidth : 5,
        //The percentage of the chart that we cut out of the middle.
        percentageInnerCutout : 70,
        //Boolean - Whether we should animate the chart 
        animation : true,
        //Number - Amount of animation steps
        animationSteps : 100,
        //String - Animation easing effect
        animationEasing : "easeOutBounce",
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate : true,
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale : false,
        //Function - Will fire on animation completion.
        onAnimationComplete : null
    }
    var graphInitDelay = 500;
    var divNbStands = $('#doughnutNbStands');

    function showDoughnutChart(){
        var ctx = document.getElementById('doughnutChartCanvas').getContext('2d');
        new Chart(ctx).Doughnut(doughnutChartData,globalGraphSettings);
        $('#doughnutNbStands').removeClass('hidden');
        changeDoughnutChart(69);
    }

    $('#doughnutChartCanvas').on('inview', function(){
        var $this = $(this);
        $this.removeClass('hidden').off('inview');
        setTimeout(showDoughnutChart,graphInitDelay);
    });

    function changeDoughnutChart(nbStands){
        divNbStands.addClass('hidden');
        divNbStands.text(nbStands+'%');
        divNbStands.removeClass('hidden');
    }
});
