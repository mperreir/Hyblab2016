"use strict";

$(document).ready(function() {
    $('#fullpage').fullpage({
    	navigation : true,
    	onLeave : relaunchAnimation,
    });

	requestGenerateChartDefilement("menage");
	requestGenerateChartDefilement("parc");
	requestGenerateChartDefilement("carburant");

	requestGenerateChartDonut("mono", "1990");
	requestGenerateChartDonut("biPlus", "1990");
	requestGenerateChartDonut("none", "1990");

	requestGenerateCars("occasion", "1990");

});

/********* TEST ***********/
