"use strict";

$(document).ready(function() {
    $('#fullpage').fullpage({
    	navigation : true,
    	onLeave : relaunchChartAnimation,
    });

	requestGenerateChart("menage");
	requestGenerateChart("parc");
	requestGenerateChart("carburant");
});

/********* TEST ***********/
function generateMenageDonut(donnee,id){

	var label = '<h3>'+donnee+'%</h3>';
	var idStr = '#'+id;
	var chart = new Chartist.Pie(idStr, {
		series: [donnee]
	}, {
		donut: true,
		showLabel: true,
		total: 100,
		donutWidth: 10,
		chartPadding: 0,
		showLabel: false,
		plugins: [
            Chartist.plugins.fillDonut({
                items: [{
					content: label
				}]
            })
        ],
	});

	chart.on('draw', function(data) {
		if(data.type === 'slice') {

			// Get the total path length in order to use for dash array animation
			var pathLength = data.element._node.getTotalLength();

			// Set a dasharray that matches the path length as prerequisite to animate dashoffset
			data.element.attr({
			  'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
			});

			// Create animation definition while also assigning an ID to the animation for later sync usage
			var animationDefinition = {
				'stroke-dashoffset': {
				id: 'anim' + data.index,
				dur: 1000,
				from: -pathLength + 'px',
				to:  '0px',
				easing: Chartist.Svg.Easing.easeOutQuint,

				// We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
				fill: 'freeze'
				}
			};


			// We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
			data.element.attr({
				'stroke-dashoffset': -pathLength + 'px'
			});

			// We can't use guided mode as the animations need to rely on setting begin manually
			// See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
			data.element.animate(animationDefinition, false);
	  }
	});
};

generateMenageDonut(60,"monomotor");
generateMenageDonut(40,"nomotor");
