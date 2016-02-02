"use strict";


function generateMenageDonut(donnee){

	var label = '<h3>'+donnee+'%</h3>'
	var chart = new Chartist.Pie('.ct-chart', {
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

generateMenageDonut(60);

/*
var chart = new Chartist.Pie('.ct-chart', {
  series: [60],
  labels: ["Monomotorisés"]
}, {
  donut: true,
  showLabel: true,
  total: 100,
  donutWidth: 10,
  chartPadding: 5,
  labelOffset: 50,
  labelDirection: 'explode'
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

	// If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
	if(data.index !== 0) {
	  animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
	}

	// We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
	data.element.attr({
	  'stroke-dashoffset': -pathLength + 'px'
	});

	// We can't use guided mode as the animations need to rely on setting begin manually
	// See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
	data.element.animate(animationDefinition, false);
  }
});
*/

