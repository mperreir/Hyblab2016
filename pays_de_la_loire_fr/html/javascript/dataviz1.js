"use strict"

$(document).ready( function () {
	var answers = document.getElementsByClassName("answers");

	for(var i = 0; i < answers.length; i++) {
		document.getElementById(answers[i].id).style.display = "none";
	}

	//document.getElementById("sectionQ").style.display = "none";
})

function startQ () {
	document.getElementById("sectionQ").style.display = "block";
}

function chooseAnswer (prop_id) {
	
}

function valideQ () {

}

function moveEntriesIn (prop_id) {

	childs = document.getElementById("question1").children;

	for(var i = 0; i < childs.length; i++) {
		if(childs[i].id != prop_id) {
			$(childs[i]).animate({ opacity: "0.4" }, 500);
		}
	}

}

function moveEntriesOut (prop_id) {

	childs = document.getElementById("question1").children;

	for(var i = 0; i < childs.length; i++) {
		$(childs[i]).animate({ opacity: "1" }, 0);
	}

}

function answerQuestions(prop_id) {

	var question = prop_id[0]+prop_id[1];
	var answer = prop_id[3]+prop_id[4];
	
	switch(question) {
		case "q1":
			switch(answer) {
				case "p3":
					document.getElementById(question+"_a").style.display = "block";
					break;

				case "p1":
				case "p2":
					break;
			}
			break;

		case "q2":
			switch(answer) {
				case "p2":
					document.getElementById(question+"_a").style.display = "block";
					break;
				case "p1":
				case "p3":
					break;
			}
			break;

		case "q3":
			switch(answer) {
				case "p1":
					document.getElementById(question+"_a").style.display = "block";
					break;
				case "p2":				
				case "p3":
				case "p4":
					break;
			}
			break;

		case "q4":
			switch(answer) {
				case "p1":
				case "p2":				
				case "p3":
				case "p4":
					document.getElementById(question+"_a").style.display = "block";
					break;
			}
			break;

		case "q5":
			switch(answer) {
				case "p1":
				case "p2":				
				case "p3":
				case "p4":
					document.getElementById(question+"_a").style.display = "block";
					break;
			}
			break;
	}
}