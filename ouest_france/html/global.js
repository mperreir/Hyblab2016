"use strict";

$(document).ready(function() {
    $('#fullpage').fullpage({
    	navigation : true,
    	onLeave : relaunchAnimation,
    });

	requestGenerateChartDefilement("menage");
	requestGenerateChartDefilement("parc");
	requestGenerateChartDefilement("carburant");

	
});

/********* TEST ***********/
