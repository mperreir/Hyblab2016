"use strict"

$(document).ready( function () {
	$.fn.fullpage.reBuild();
	var elementsToHide = document.getElementsByClassName("answers");

	for(var i = 0; i < elementsToHide.length; i++) {
		document.getElementById(elementsToHide[i].id).style.display = "none";
	}

	// Animation de la slide d'intro
	animIntro();

	document.getElementById("bouton_2008_data1").style.pointerEvents = "none";

	//document.getElementById("sectionQ").style.display = "none";
})

function animIntro() {
	$(nuage1)
		.transition({
					opacity: 1,
					left: '13.5%',
					delay: 500 }, 1000, 'linear');
	$(nuage2)
		.transition({
					opacity: 1,
					left: '47.5%',
					delay: 500 }, 1000, 'linear');
	$(nuage3)
		.transition({
					opacity: 1,
					left: '65%',
					delay: 500 }, 1000, 'linear');

	$(tracteur_intro)
		.transition({
					left: '-15%',
					delay: 1100 }, 30000, 'linear');

	$(bateau_intro)
		.transition({
					left: '110%',
					delay: 1100 }, 30000, 'linear');

	$(pale_intro_1)
		.transition({
					rotate: '1440deg',
					delay: 1100 }, 40000, 'linear');

	$(pale_intro_2)
		.transition({
					rotate: '1440deg',
					delay: 920 }, 28300, 'linear');

	$(pale_intro_3)
		.transition({
					rotate: '1440deg',
					delay: 1280 }, 34500, 'linear');
}

/* Remise en place des éléments de l'intro pour pouvoir rejouer l'animation */
function resetIntro () {
	$(nuage1).stop(true, true);
	$(nuage2).stop(true, true);
	$(nuage3).stop(true, true);
	$(tracteur_intro).stop(true, true);
	$(bateau_intro).stop(true, true);
	$(pale_intro_1).stop(true, true);
	$(pale_intro_2).stop(true, true);
	$(pale_intro_3).stop(true, true);

	$(nuage1)
		.transition({
					opacity: 0,
					left: '0%' });
	$(nuage2)
		.transition({
					opacity: 0,
					left: '60%' });
	$(nuage3)
		.transition({
					opacity: 0,
					left: '80%' });

	$(tracteur_intro)
		.transition({
					left: '32.5%' });

	$(bateau_intro)
		.transition({
					left: '80%' });

	$(pale_intro_1)
		.transition({
					rotate: '0deg' });

	$(pale_intro_2)
		.transition({
					rotate: '0deg' });

	$(pale_intro_3)
		.transition({
					rotate: '0deg' });
}

/* Fonction passant à la section suivante (scroll vertical) */
function startQ () {
	$.fn.fullpage.moveSectionDown();
}

/* Fonction passant à la slide suivante (scroll horizontal) */
function moveNextQ (button) {
	console.debug("Next Q");
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

/* Remise en place des éléments d'une slide pour pouvoir rejouer la question et les animations */
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

	switch(idQ) {
		case "q1":
			$(france).transition({
				left: '25%'
			})
			$(pays_de_la_loire).transition({
				scale: 1,
				left: '27.1%'
			})
			break;

		case "q2":
			$(ampoule_q2).transition({
				scale: 1,
				left: '44%'
			})
			$(batiment_q2).transition({
				scale: 1,
				left: '48%'
			})
			$(euro_q2).transition({
				scale: 1,
				left: '52%'
			})
			break;

		case "q3":
			$(elements_q3).transition({
				scale: 1,
				left: '60%'
			})
			$(panneau_1_q3).transition({
				scale: 1,
				left: '70.75%'
			})
			$(panneau_2_q3).transition({
				scale: 1,
				left: '71.5%'
			})
			$(panneau_3_q3).transition({
				scale: 1,
				left: '70%'
			})
			$(tracteur_q3).transition({
				scale: 1,
				left: '65%'
			})
			$(pale_1_q3).transition({
				scale: 1,
				left: '70.8%',
				top: '30.8%'
			})
			$(pale_2_q3).transition({
				scale: 1,
				left: '73.02%',
				top: '30.7%'
			})
			$(pale_3_q3).transition({
				scale: 1,
				left: '71.87%',
				top: '33.7%'
			})
			break;

		case "q4":
			$(elements_q4).transition({
				scale: 1,
				left: '85.5%'
			})
			break;
	}

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

	// Stop les animations de la question 3
	stopAnimTracteurQ3();
	stopAnimPanneauQ3();
	stopAnimPaleQ3();
	hidePerso();

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

	function animFrance() {
		$(pays_de_la_loire).stop(true, true);

		$(france).transition({
			left: '20%'
		})
		$(pays_de_la_loire).transition({
			left: '22.1%'
		})
	}

	function animEuro() {
		$(ampoule_q2).transition({
			scale: 0.6,
			left: '40%'
		})
		$(batiment_q2).transition({
			scale: 0.5,
			left: '42%'
		})
		$(euro_q2).transition({
			scale: 0.5,
			left: '44%'
		})
	}

	function animElementsQ3 () {
		$(elements_q3).transition({
			scale: 0.7,
			left: '55%'
		})
		$(panneau_1_q3).transition({
			scale: 0.8,
			left: '65.5%'
		})
		$(panneau_2_q3).transition({
			scale: 0.8,
			left: '66.5%'
		})
		$(panneau_3_q3).transition({
			scale: 0.8,
			left: '65%'
		})
		$(tracteur_q3).transition({
			scale: 0.8,
			left: '61%',
			top: '54%'
		})
		$(pale_1_q3).transition({
			scale: 0.7,
			left: '65.31%',
			top: '35.8%'
		})
		$(pale_2_q3).transition({
			scale: 0.7,
			left: '66.06%',
			top: '37.7%'
		})
		$(pale_3_q3).transition({
			scale: 0.7,
			left: '66.87%',
			top: '35.7%'
		})
	}

	function animElementsQ4 () {
		$(elements_q4).transition({
			scale: 0.8,
			left: '80.5%'
		})

		$(maison1_q4).transition({
			opacity: 0
		}, 500)
		$(maison2_q4).transition({
			opacity: 0
		}, 500)
		$(maison3_q4).transition({
			opacity: 0
		}, 500)
		$(maison4_q4).transition({
			opacity: 0
		}, 500)
		$(maison5_q4).transition({
			opacity: 0
		}, 500)
		$(maison6_q4).transition({
			opacity: 0
		}, 500)
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
					animFrance();
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
					animFrance();
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
					animEuro();
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
					animEuro();
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
					animElementsQ3();
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
					animElementsQ3();
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
					animElementsQ4();
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
					animElementsQ4();
					break;
			}
			break;
	}
}

function hidePerso () {

			var perso1 = document.getElementById("perso1_q4");
			var perso2 = document.getElementById("perso2_q4");
			var perso3 = document.getElementById("perso3_q4");

			$(perso1).transition({
				opacity: 0
			}, 500)
			$(perso2).transition({
				opacity: 0
			}, 500)
			$(perso3).transition({
				opacity: 0
			}, 500)
}

function goTo2008 () {
	var elements = document.getElementsByClassName("elem_14");
	var num_rand;

	$(bouton_2008_data1).stop(true, true);

	for(var i = 0; i < elements.length; i++)
	{
		num_rand = Math.random();

		// Application d'une animation
		$(elements[i]).transition({
				left: '+=5%',
				top: '+=6%',
				opacity: 0,
				delay: num_rand*100
			}, 500)
	}

	$(bouton_2014_data1).transition({
		scale: 0.8,
		opacity: 0.5
	})
	$(bouton_2008_data1).transition({
		scale: 1.3,
		opacity: 1
	})

	for(i = 0; i < 10; i++) {
		$(bouton_2014_data1).transition({
			scale: 1.2,
		})
		$(bouton_2014_data1).transition({
			scale: 0.8,
		}, 800)
	}

	document.getElementById("bouton_2008_data1").style.pointerEvents = "none";
	document.getElementById("bouton_2014_data1").style.pointerEvents = "auto";
}

function goTo2014 () {
	var elements = document.getElementsByClassName("elem_14");
	var num_rand;

	$(bouton_2014_data1).stop(true, true);

	for(var i = 0; i < elements.length; i++)
	{
		num_rand = Math.random();

		// Application de l'animation inverse
		if($(elements[i]).hasClass("element_decor")) {
			$(elements[i]).transition({
					left: '-=5%',
					top: '-=6%',
					opacity: 0.6,
					delay: num_rand*100
				}, 500)
		} else {
			$(elements[i]).transition({
					left: '-=5%',
					top: '-=6%',
					opacity: 1,
					delay: num_rand*100
				}, 500)
		}
	}

	$(bouton_2014_data1).transition({
		scale: 1.3,
		opacity: 1
	})
	$(bouton_2008_data1).transition({
		scale: 0.8,
		opacity: 0.5
	})

	for(i = 0; i < 10; i++) {
		$(bouton_2008_data1).transition({
			scale: 1.2,
		})
		$(bouton_2008_data1).transition({
			scale: 0.8,
		}, 800)
	}

	document.getElementById("bouton_2008_data1").style.pointerEvents = "auto";
	document.getElementById("bouton_2014_data1").style.pointerEvents = "none";
}

function setPDLSize (grosseur) {
	switch(grosseur) {
		case 1:
			$(pays_de_la_loire).transition({
				scale: 1
			},500, 'easeInOutCubic')
			break;
		case 2:
			$(pays_de_la_loire).transition({
				scale: 1.3
			},500, 'easeInOutCubic')
			break;
		case 3:
			$(pays_de_la_loire).transition({
				scale: 1.6
			},500, 'easeInOutCubic')
			break;
	}
}

function animQ3 (element) {
	switch(element) {
		case 1:
			$(pale_1_q3).transition({
					rotate: '1480deg',
					delay: 920 }, 18100, 'linear');
			$(pale_2_q3).transition({
					rotate: '1480deg',
					delay: 710 }, 9800, 'linear');
			$(pale_3_q3).transition({
					rotate: '1480deg',
					delay: 1154 }, 12540, 'linear');

			stopAnimPanneauQ3();
			stopAnimTracteurQ3();
			break;

		case 2:
			for(var i = 0; i < 5; i++) {
				$(panneau_1_q3).transition({
						scale: 1.2,
						delay: 920
				});
				$(panneau_2_q3).transition({
						scale: 1.4,
						delay: 710
				});
				$(panneau_3_q3).transition({
						scale: 1.1,
						delay: 1154
				});

				$(panneau_1_q3).transition({
						scale: 1
				});
				$(panneau_2_q3).transition({
						scale: 1
				});
				$(panneau_3_q3).transition({
						scale: 1
				});
			}

			stopAnimTracteurQ3();
			stopAnimPaleQ3();			
			break;

		case 3:
			$(tracteur_q3).transition({
				left: '61%'
			}, 10000, 'linear');

			stopAnimPanneauQ3();
			stopAnimPaleQ3();
			break;
	}
}

function stopAnimPaleQ3 () {
	$(pale_1_q3).stop(true, true);
	$(pale_2_q3).stop(true, true);
	$(pale_3_q3).stop(true, true);

	$(pale_1_q3).transition({
		rotate: '0deg'
	});
	$(pale_2_q3).transition({
		rotate: '0deg'
	});
	$(pale_3_q3).transition({
		rotate: '0deg'
	});
}

function stopAnimTracteurQ3 () {
	$(tracteur_q3).stop(true, true);
	$(tracteur_q3).transition({
		left: '65%'
	});
}

function stopAnimPanneauQ3 () {
	$(panneau_1_q3).stop(true, true);
	$(panneau_2_q3).stop(true, true);
	$(panneau_3_q3).stop(true, true);

	$(panneau_1_q3).transition({
		scale: 1
	});
	$(panneau_2_q3).transition({
		scale: 1
	});
	$(panneau_3_q3).transition({
		scale: 1
	});
}

function displayHouses (nombre) {
	switch(nombre) {
		case 1:
			$(maison3_q4).transition({
				opacity: 1
			}, 500)

			$(maison1_q4).transition({
				opacity: 0
			}, 500)
			$(maison4_q4).transition({
				opacity: 0
			}, 500)
			$(maison2_q4).transition({
				opacity: 0
			}, 500)
			$(maison5_q4).transition({
				opacity: 0
			}, 500)
			$(maison6_q4).transition({
				opacity: 0
			}, 500)
			$(perso1_q4).transition({
				opacity: 0
			}, 500)
			$(perso2_q4).transition({
				opacity: 0
			}, 500)
			$(perso3_q4).transition({
				opacity: 0
			}, 500)
			break;

		case 2:
			displayHouses(1);

			$(maison1_q4).transition({
				opacity: 1
			}, 500)
			$(maison4_q4).transition({
				opacity: 1
			}, 500)
			$(perso1_q4).transition({
				opacity: 1
			}, 500)
			break;

		case 3:
			displayHouses(2);

			$(maison2_q4).transition({
				opacity: 1
			}, 500)
			$(maison5_q4).transition({
				opacity: 1
			}, 500)
			$(maison6_q4).transition({
				opacity: 1
			}, 500)
			$(perso2_q4).transition({
				opacity: 1
			}, 500)
			$(perso3_q4).transition({
				opacity: 1
			}, 500)
			break;
	}
}