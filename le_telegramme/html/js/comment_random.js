"use strict";

$(document).ready(function() {
	$("#comments_1").on('click', function() {
		console.log('clic comments_1');
		$.get('data/comments.json', function(data) { // JQuery HTTP GET request to the server
			//If the request is OK :
			try {
			  // var comments = JSON.parse(data); // parse json string answer to get a javascript object
			  var avis = false;
			  var rand = 0;
			  while(!avis){
			  	rand = Math.floor((Math.random() * 246) + 1);
			  	if(data[rand].FIELD5 = "Avis") avis = true;
			  }

			  $("#comment1").text(data[rand].FIELD1);
			  $("#sexe1").text(data[rand].FIELD3 + ', ' + data[rand].FIELD4);

			} catch (e) {
			  console.error("Parsing error:", e); 
			}
		});
	});

	$("#comments_2").on('click', function() {
		console.log('clic comments_1');
		$.get('data/comments.json', function(data) { // JQuery HTTP GET request to the server
			//If the request is OK :
			try {
			  // var comments = JSON.parse(data); // parse json string answer to get a javascript object
			  var souvenir = false;
			  var rand = 0;
			  while(!souvenir){
			  	rand = Math.floor((Math.random() * 246) + 1);
			  	if(data[rand].FIELD5 = "souvenir") souvenir = true;
			  }
			  
			  $("#comment2").text(data[rand].FIELD1);
			  $("#sexe2").text(data[rand].FIELD3 + ', ' + data[rand].FIELD4);

			} catch (e) {
			  console.error("Parsing error:", e); 
			}
		});
	});
});