"use strict";

/*global requestGenerateChartDefilement*/
/*global relaunchAnimation*/
/*global animateImage*/
/*gloabel animatecCloud*/

$(document).ready(function() {
    $('#fullpage').fullpage({
    	navigation : true,
    	onLeave : relaunchAnimation
    });
    counterSoldCars();
	requestGenerateChartDefilement("menage");
	requestGenerateChartDefilement("parc");
	requestGenerateChartDefilement("carburant");
	animateCloud(".nuage");
	animateImage(".accueil");
	animateMethodo();
});
