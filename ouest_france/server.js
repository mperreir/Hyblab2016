// Load usefull expressjs and nodejs objects / modules
var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

var donnees;

fs.readFile('./ouest_france/data/data.json', 'utf-8', function(err, data){
	if(err) throw err;
	else donnees = JSON.parse(data);
});

// Minimum routing: serve static content from the html directory
app.use(express.static(path.join(__dirname, 'html')));

// You can then add whatever routing code you need


app.get("/data/", getData);
//Tableaux des années disponibles pour une catégorie (menage ou carburant ou achat)
app.get("/data/:categorie/available_years", getCategorieAvailableYears);
//Données pour la catégorie donnée triées par années
app.get("/data/:categorie/years", getCategorieAllYears);
//Données pour la catégorie donnée pour une année
app.get("/data/:categorie/years/:year", getCategoriePerYear);
//Données pour la catégorie donnée et pour un type donné et pour une années donnée
app.get("/data/:categorie/:type/:year", getCategorieTypeYear);
//Données pour une catégorie, pour un type et toutes les années dispos
app.get("/data/:categorie/:type", getCategorieType);
//Données pour une catégorie donnée
app.get("/data/:categorie", getCategorie);

function resHeader(res){
	res.writeHead(200, {
		'Content-Type' : 'text/json'
	});
};

function stringifyPerso(obj){
	return JSON.stringify(obj,null,4);
};

function getAtt(obj){
	var retour = [];
	for(elem in obj) retour.push(elem);
	return retour;
};
function getData(req, res){
	var retour = {};
	resHeader(res);
	retour.categorie = null;
	retour.dataType = getAtt(donnees);
	retour.data = {};
	retour.dataType.forEach(function(dataType){
		retour.data[dataType] = donnees[dataType];
		retour.data[dataType].dataType = getAtt(retour.data[dataType].data);
	})
	res.write(stringifyPerso(retour));
	res.end();
};

function getCategorie(req,res){
	resHeader(res);
	var categorie = req.params.categorie;
	var retour = {};
	if(!donnees[categorie]) retour.err = "undefined data";
	else{
		retour.categorie = categorie;
		retour.dataType = getAtt(donnees[categorie].data);
		retour.years = donnees[categorie].years;
		retour.data = donnees[categorie].data;
	};
	res.write(stringifyPerso(retour));
	res.end();
};

function getCategorieAvailableYears(req,res){
	resHeader(res);
	var categorie = req.params.categorie;
	var retour = {};
	if(!donnees[categorie]) retour.err = "undefined data";
	else{
		retour.categorie = categorie;
		retour.years = donnees[categorie].years;
	};
	res.write(stringifyPerso(retour));
	res.end();
};

function getCategorieType(req,res){
	resHeader(res);
	var categorie = req.params.categorie;
	var type = req.params.type;
	var retour = {};
	if(!donnees[categorie].data[type]) retour.err = "undefined data";
	else{
		retour.categorie = categorie;
		retour.dataType = [type];
		retour.years = donnees[categorie].years;
		retour.data = {};
		retour.data[type] = donnees[categorie].data[type];
	};
	res.write(stringifyPerso(retour));
	res.end();
};

function getCategoriePerYear(req,res){
	
	resHeader(res);
	var categorie = req.params.categorie;
	var year = req.params.year;
	var retour = {};
	if(donnees[categorie].years.indexOf(year) == -1) res.write(stringifyPerso({"err":"undefined data"}));
	else{
		retour.categorie = categorie;
		retour.years = [year];
		retour.dataType = getAtt(donnees[categorie].data);
		retour.data = {};
		retour.data[year] = {};
		for(type in donnees[categorie].data){
			retour.data[year][type] = donnees[categorie].data[type][year];
		};
		res.write(stringifyPerso(retour));
	};
	res.end();
};

function getCategorieAllYears(req,res){
	
	resHeader(res);
	var categorie = req.params.categorie;
	var retour = {};
	if(!donnees[categorie]) res.write(stringifyPerso({"err":"undefined data"}));
	else{
		retour.years = donnees[categorie].years;
		retour.categorie = categorie;
		retour.dataType = getAtt(donnees[categorie].data);
		retour.data = {};
		donnees[categorie].years.forEach(function(year){
			retour.data[year] = {}
			for(type in donnees[categorie].data){
				retour.data[year][type] = donnees[categorie].data[type][year];
			};
		});
		res.write(stringifyPerso(retour));
	}
	res.end();
}

function getCategorieTypeYear(req,res){
	resHeader(res);
	var categorie = req.params.categorie;
	var type = req.params.type;
	var year = req.params.year;
	var retour = {};
	if(!donnees[categorie].data[type][year]) retour.err = "undefined data";
	else{
		retour.years = [year];
		retour.dataType = [type];
		retour.type = type;
		retour.categorie = categorie;
		retour.data = {};
		retour.data[type] = {};
		retour.data[type][year] = donnees[categorie].data[type][year];
	};
	res.write(stringifyPerso(retour));
	res.end();
};

// This module is exported and served by the main server.js located
// at the root of this set of projects. You can access it by lanching the main
// server and visiting http(s)://127.0.0.1:8080/name_of_you_project/ (if on a local server)
// or more generally: http(s)://server_name:port/name_of_you_project/
module.exports = app;
