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
		break;

		case "3rdPage" :
		break;

		case "4thPage" :
		break;

		case "5thPage" :
		break;

		case "6thPage" :
			initI3();
		break;

		case "7thPage" :
		//alert("start");
			init3();
		break;

		case "8thPage" :
		break;

		case "lastPage" :
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
			break;

			case "6thPage" :
				stopAnims();
			break;

			case "7thPage" :
				//alert("reset");
				reset3();
			break;

			case "8thPage" :
			break;

			case "lastPage" :
			break;
		}
	}

	previousSection = currentSection;
}