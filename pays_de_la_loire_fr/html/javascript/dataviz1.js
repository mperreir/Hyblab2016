"use strict"

$(document).ready( function () {
	var elementsToHide = document.getElementsByClassName("answers");

	for(var i = 0; i < elementsToHide.length; i++) {
		document.getElementById(elementsToHide[i].id).style.display = "none";
	}

	// Animation de la slide d'intro
	animIntro();

	//document.getElementById("sectionQ").style.display = "none";
})

function animIntro() {
	var nuage1 = document.getElementById("nuage1");
	var nuage2 = document.getElementById("nuage2");
	var nuage3 = document.getElementById("nuage3");

	$(nuage1)
		.transition({
					opacity: 1,
					x: 200,
					scale: 4 }, 1500, 'cubic-bezier(0,0.9,0.3,1)');
	$(nuage2).transition({ opacity: 1 }, 700);
	$(nuage3).transition({ opacity: 1 }, 700);
}

function startQ () {
	//document.getElementById("sectionQ").style.display = "block";
	$.fn.fullpage.moveSectionDown();
}

/* Fonction passant à la slide suivante (scroll horizontal) */
function moveNextQ (button) {
	$.fn.fullpage.moveSlideRight();
	var idQ = button[0]+button[1];
	resetSlide(idQ);
}

/* Fonction passant à la section suivante (scroll vertical) */
function moveNextS (button) {
	$.fn.fullpage.moveSectionDown();
	var idQ = button[0]+button[1];
	resetSlide(idQ);
}

function resetSlide (idQ) {	
	// Cacher les blocs réponses
	var bad_block = document.getElementById(idQ+"_ab");
	var good_block = document.getElementById(idQ+"_ag");

	bad_block.style.display = "none";
	good_block.style.display = "none";

	// Background des propositions à #E1F1F3 et onclick
	var props = document.getElementById(idQ).children;

	for(var i = 0; i < props.length; i++) {
		if(props[i].nodeName == "LI") {
			document.getElementById(props[i].id).style.backgroundColor = "#E1F1F3";
			document.getElementById(props[i].id).style.pointerEvents = "auto";
		}
	}

	document.getElementById(idQ+"_b").style.pointerEvents = "auto";

}

function chooseAnswer (prop_id) {
	var idQ = document.getElementById(prop_id).parentElement.id;
	var childs = document.getElementById(prop_id).parentElement.children;

	for(var i = 0; i < childs.length; i++) {
		if(childs[i].id != prop_id && childs[i].nodeName == "LI") {
			document.getElementById(childs[i].id).style.backgroundColor = "#E1F1F3";
			document.getElementById(childs[i].id).className = "";
		} else if(childs[i].id == prop_id && childs[i].nodeName == "LI") {
			document.getElementById(childs[i].id).style.backgroundColor = "#AFDCDF";
			document.getElementById(childs[i].id).className = "tmp_answer";
		}
	}

	var valid_button = document.getElementById(idQ+"_b");

	for(i = 0; i < 3; i++) {
		$(valid_button).transition({ scale: 1.25 }, 700);
		$(valid_button).transition({ scale: 1 }, 700);
	}
}

function answerQuestions(prop_id) {

	// Récupère l'id de l'élément <ul> contenant les propositions
	var idQ = document.getElementById(prop_id).parentElement.id;

	var valid_button = document.getElementById(idQ+"_b");
	$(valid_button).stop(true);

	var question = prop_id[0]+prop_id[1];
	var childs = document.getElementById(question).children;

	for(var i = 0; i < childs.length; i++) {
		if(document.getElementById(childs[i].id).className == "tmp_answer")
		{
			var answer = childs[i].id;
			answer = answer[3]+answer[4];
		}
		document.getElementById(childs[i].id).style.pointerEvents = "none";
	}

	var bad_bloc = document.getElementById(question+"_ab");
	var good_bloc = document.getElementById(question+"_ag");
	var good_arrow = document.getElementById(question+"_ag_button");
	var bad_arrow = document.getElementById(question+"_ab_button");

	function appear(bloc) {
		bloc.style.opacity = 0;
		$(bloc).transition({
			opacity: 1,
			x: 20
		});
	}

	function disappear(bloc) {
		$(bloc).transition({
			opacity: 0,
			x: -20
		});
	}

	function animContinue (arrow) {
		for(var i = 0; i < 5; i++) {
			$(arrow).transition({ scale: 1.5 }, 650);
			$(arrow).transition({ scale: 1 }, 650);
		}
	}
	
	switch(question) {
		case "q1":
			switch(answer) {
				// Bonne réponse
				case "p3":
					disappear(bad_bloc);
					bad_bloc.style.display = "none";
					good_bloc.style.display = "table";
					good_bloc.style.visibility = "visible";
					appear(good_bloc);
					animContinue(good_arrow);
					break;

				// Mauvaises réponses
				case "p1":
				case "p2":
					bad_bloc.style.display = "table";
					bad_bloc.style.visibility = "visible";
					appear(bad_bloc);
					disappear(good_bloc);
					good_bloc.style.display = "none";
					animContinue(bad_arrow);
					break;
			}
			break;

		case "q2":
			switch(answer) {
				// Bonne réponse
				case "p2":
					disappear(bad_bloc);
					bad_bloc.style.display = "none";
					good_bloc.style.display = "table";
					good_bloc.style.visibility = "visible";
					appear(good_bloc);
					animContinue(good_arrow);
					break;

				// Mauvaises réponses
				case "p1":
				case "p3":
					bad_bloc.style.display = "table";
					bad_bloc.style.visibility = "visible";
					appear(bad_bloc);
					disappear(good_bloc);
					good_bloc.style.display = "none";
					animContinue(bad_arrow);
					break;
			}
			break;

		case "q3":
			switch(answer) {
				// Bonne réponse
				case "p1":
					disappear(bad_bloc);
					bad_bloc.style.display = "none";
					good_bloc.style.display = "table";
					good_bloc.style.visibility = "visible";
					appear(good_bloc);
					animContinue(good_arrow);
					break;

				// Mauvaises réponses
				case "p2":				
				case "p3":
					bad_bloc.style.display = "table";
					bad_bloc.style.visibility = "visible";
					appear(bad_bloc);
					disappear(good_bloc);
					good_bloc.style.display = "none";
					animContinue(bad_arrow);
					break;
			}
			break;

		case "q4":
			switch(answer) {
				// Bonne réponse
				case "p3":
					bad_bloc.style.display = "none";
					disappear(bad_bloc);
					good_bloc.style.display = "table";
					good_bloc.style.visibility = "visible";
					appear(good_bloc);
					animContinue(good_arrow);
					break;

				// Mauvaises réponses
				case "p1":				
				case "p2":
					bad_bloc.style.display = "table";
					bad_bloc.style.visibility = "visible";
					appear(bad_bloc);
					good_bloc.style.display = "none";
					disappear(good_bloc);
					animContinue(bad_arrow);
					break;
			}
			break;
	}
}