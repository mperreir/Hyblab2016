var data;
/*EXEMPLE JQUERY REQUETE HTTP*/
/*$(document).ready(function(){
	var requete = $.ajax({
		url : "http://127.0.0.1:8080/ouest_france/data",
		type : "GET",
		dataType : "text",
		success : function(res, statut){
			console.log("OK");
		},
		error : function(res, statut, error){
			alert(res+" ; "+statut+" ; "+error);
		},
		complete : function(res, statut){

		}
	});
});*/

$('body').css("background-color", "black");

$('body').click(function(){
	console.log("yolooooo");
});

/*
var data = undefined;
var apiAddr = "http://127.0.0.1:8080/ouest_france/data";
fetch('http://127.0.0.1:8080/ouest_france/data/parc/years/2009').then(function(response) {
    return response.json()
  }).then(function(json) {
  	data = {};
    data.json = json;
    return json;
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  });

$(document).click(function(){
	if(data) console.log(JSON.stringify(data));
});*/
