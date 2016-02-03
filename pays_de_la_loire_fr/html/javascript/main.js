'use strict';

var currentSection;
var previousSection;

$(document).ready(function() {
      
      currentSection = document.getElementsByClassName("active")[0].getAttribute('data-anchor');
     // reset3();
});

function updateCurrentSection(){

	var n = document.getElementsByClassName("active").length;
	for(var i = 0; i < n; i++) {
 		currentSection = document.getElementsByClassName("active")[i].getAttribute('data-anchor');
 		if(currentSection != null) {
 			break;
 		}
	}

	// Actions effectuées lorsqu'on entre dans la section
	switch(currentSection) {

		case "firstPage" :
			
		break;

		case "secondPage" :
			reset3();
		break;

		case "3rdPage" :
		break;

		case "4thPage" :

		break;

		case "5thPage" :
			initI3();
		break;

		case "6thPage" :
			init3();
		break;

		case "7thPage" :
		//alert("start");
			reset3();
		break;

		case "8thPage" :
		break;
	}

	// Actions effectuées lorsqu'on quitte la section
	if(previousSection) {
		switch(previousSection) {

			case "firstPage" :

			break;

			case "secondPage" :
			break;

			case "3rdPage" :
			break;

			case "4thPage" :

			break;

			case "5thPage" :
				stopAnims();
			break;

			case "6thPage" :
				reset3();
			break;

			case "7thPage" :
				//alert("reset");
				
			break;

			case "8thPage" :
			break;

		}
	}

	previousSection = currentSection;
}