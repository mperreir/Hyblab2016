"use strict";

$(document).ready(function() {
    $('#fullpage').fullpage({
    	navigation : true,
    	onLeave : relaunchAnimation,
    });

	requestGenerateChartDefilement("menage");
	requestGenerateChartDefilement("parc");
	requestGenerateChartDefilement("carburant");
<<<<<<< Updated upstream
=======

	var test = {
	  labels: ['Essence', 'GNV', 'Électricité', 'Diesel'],
	  series: [[
	    1,2,3,4
	  ]]
};
	generateBarChart(test);
>>>>>>> Stashed changes
});
