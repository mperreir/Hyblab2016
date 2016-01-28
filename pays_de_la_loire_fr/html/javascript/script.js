"use-strict"

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

	var img_answer = document.createElement("img");
	
	switch(question) {
		case "q1":
			switch(answer) {
				case "p1":
					img_answer.src = "../resources/check.png";
					document.getElementById(prop_id).appendChild(img_answer);
					break;

				case "p2":
				case "p3":
				case "p4":
					img_answer.src = "../resources/cross.png";
					document.getElementById(prop_id).appendChild(img_answer);
					break;
			}
			break;

		case "q2":
			switch(answer) {
				case "p2":
					img_answer.src = "../resources/check.png";
					document.getElementById(prop_id).appendChild(img_answer);
					break;
				case "p1":
				case "p3":
				case "p4":
					img_answer.src = "../resources/cross.png";
					document.getElementById(prop_id).appendChild(img_answer);
					break;
			}
			break;

		case "q3":
			switch(answer) {
				case "p1":
				case "p2":				
				case "p3":
					img_answer.src = "../resources/cross.png";
					document.getElementById(prop_id).appendChild(img_answer);
					break;
				case "p4":
					img_answer.src = "../resources/check.png";
					document.getElementById(prop_id).appendChild(img_answer);
					break;
			}
			break;

		case "q4":
			switch(answer) {
				case "p1":
				case "p2":				
				case "p3":
				case "p4":
					img_answer.src = "../resources/check.png";
					document.getElementById(prop_id).appendChild(img_answer);
					break;
			}
			break;

		case "q5":
			switch(answer) {
				case "p1":
				case "p2":				
				case "p3":
				case "p4":
					img_answer.src = "../resources/check.png";
					document.getElementById(prop_id).appendChild(img_answer);
					break;
			}
			break;
	}
}