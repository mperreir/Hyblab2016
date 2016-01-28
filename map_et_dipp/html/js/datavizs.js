

var produits = [ {"produit":"Légumes","distanceMoyenne":9999, "distMin":9999, "distMax":0},
  {"produit":"Fruits", "distanceMoyenne":9999, "distMin":9999, "distMax":0},
  {"produit": "Produits Laitiers","distanceMoyenne":9999, "distMin":9999, "distMax":0},
  {"produit": "Viande","distanceMoyenne":9999, "distMin":9999, "distMax":0},
  {"produit": "Miel","distanceMoyenne":9999, "distMin":9999, "distMax":0},
  {"produit": "Autres","distanceMoyenne":9999, "distMin":9999, "distMax":0}];


var jardinJoseph = {
    "printemps": {"total": 180369, "racines": 12850, "poids_haricots": 10934, "choux": 8760, "epinards_salades": 19851, "courges": 77400, "tomates": 35314, "aromatiques": 1260, "fruits": 11600, "autres": 2400},
    "été": {"total": 118850, "racines": 7200, "poids_haricots": 5466, "choux": 0, "epinards_salades": 6671, "courges": 0, "tomates": 88286, "aromatiques": 1267, "fruits": 2695, "autres": 7265}, 
    "automne": {"total": 22208, "racines": 0, "poids_haricots": 0, "choux": 2920, "epinards_salades": 0, "courges": 0, "tomates": 0, "aromatiques": 1273, "fruits": 15715, "autres": 2300},
    "hiver": {"total": 16153, "racines": 0, "poids_haricots": 0, "choux": 2920, "epinards_salades": 13233, "courges": 0, "tomates": 0, "aromatiques": 0, "fruits": 0, "autres": 0}
};





function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
/**
 * Retourne le point résultant de la rotation d'un point par rapport à un point central et d'un angle
 * @param   {number} xToRotate coordonnée x du point sur lequel la rotation est effectuée
 * @param   {number} yTORotate coordonnée y du point sur lequel la rotation est effectuée
 * @param   {number} xCenter   coordonnée x du point central de la rotation
 * @param   {number} yCenter   coordonnée y du point central de la rotation
 * @param   {number} angle     l'angle de la rotation
 * @returns {object} objet contenant les coordonnées x et y du point résultant
 */
function rotatePoint(xToRotate, yTORotate, xCenter, yCenter, angle) {
    var X = xCenter - xToRotate;
    var Y = yCenter - yTORotate;
    var xRotate = xCenter + X * Math.cos(angle) - Y * Math.sin(angle);
    var yRotate = yCenter + X * Math.sin(angle) + Y * Math.cos(angle);
    return {
        x: xRotate, 
        y: yRotate
    }
}


var dataset;

$.getJSON('./js/donneesAMAPSProducteurs.js', function(data){ 
	dataset = data; 





dataset.forEach(function (d) {
	d.Distance = getDistanceFromLatLonInKm(d.LATProd, d.LONGProd, d.LATAMAP, d.LONGAMAP);
});

var s=-1;
var qte = -1;
var moy = -1;

var lesp = [];

produits.forEach(function(p)
{
	s = 0;
	qte = 0;
	moy = 0;
	dataset.forEach(function(d){
		
		if(d.Produits == p.produit)
		{
			if(d.Distance < p.distMin)
				p.distMin = d.Distance;
			if(d.Distance > p.distMax)
				p.distMax = d.Distance;
			s += d.Distance;
			qte ++;
		}
	});
	moy = s/qte;
	p.distanceMoyenne = moy;
	
});


var svgJoseph = d3.select("#legumesJoseph").append("svg").attr("width", 500).attr("height", 500);




var nantesRadius = [50];
var width = 500;
var height = 500;
var svg = d3.select("#araigneeAMAP").append("svg").attr("width",width).attr("height",height);

//DESSIN du cercle représentant nantes
svg.selectAll("circle").data(nantesRadius).enter().append("circle").attr("cx", width/2).attr("cy",height/2).attr("r",50).attr("fill","teal");








var groupes = svg.selectAll("g").data(produits).enter();


// DESSIN DES LIGNES DES DISTANCES
var lignesMax = groupes.append("line").attr("x1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	//var angle = 360 * i / produits.length;
	var angle = 60*i;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	var angle = 60 * i;// / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("x2",function(d,i){
	var x = (width/2) - nantesRadius - d.distMax;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y2",function(d,i){
	var x = (width/2) - nantesRadius - d.distMax;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("stroke-width",2).attr("stroke","yellow");

var lignesMoyenne = groupes.append("line").attr("x1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("x2",function(d,i){
	var x = (width/2) - nantesRadius - d.distanceMoyenne;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y2",function(d,i){
	var x = (width/2) - nantesRadius - d.distanceMoyenne;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("stroke-width",2).attr("stroke","green");

var lignesMin = groupes.append("line").attr("x1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("x2",function(d,i){
	var x = (width/2) - nantesRadius - d.distMin;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y2",function(d,i){
	var x = (width/2) - nantesRadius - d.distMin;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("stroke-width",2).attr("stroke","red");

var pointsMax = groupes.append("circle").attr("cx", function(d, i) {
    var x = (width/2) - nantesRadius - d.distMax;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("cy", function(d, i) {
    var x = (width/2) - nantesRadius - d.distMax;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("r", 5).attr("fill","yellow");


var pointsMin = groupes.append("circle").attr("cx", function(d, i) {
    var x = (width/2) - nantesRadius - d.distMin;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("cy", function(d, i) {
    var x = (width/2) - nantesRadius - d.distMin;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("r", 5).attr("fill","red");


var pointsMoy = groupes.append("circle").attr("cx", function(d, i) {
    var x = (width/2) - nantesRadius - d.distanceMoyenne;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("cy", function(d, i) {
    var x = (width/2) - nantesRadius - d.distanceMoyenne;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("r", 5).attr("fill","green");




/*
var lines = svg.selectAll("line").data(produits).enter().append("line").attr("x1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("x2",function(d,i){
	var x = (width/2) - nantesRadius - d.distMax;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y2",function(d,i){
	var ley = d.distMax*Math.sin((360/produits.length)*i)+(height/2);
	var x = (width/2) - nantesRadius - d.distMax;
	var y = (height/2);
	var angle = 360 * i / produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("stroke-width",2).attr("stroke","black");
*/




svg.selectAll("rect").data(produits).enter().append("rect").attr("x", function(d,i){
	return i*20;
}).attr("y",function(d){return height-(d.distanceMoyenne);}).attr("width",19).attr("height",function(d){
	return d.distanceMoyenne;
}).attr("fill", function(d){
	return "rgb(0,"+(d.distanceMoyenne*10)+",0)";
});
svg.selectAll("text").data(produits).enter().append("text").text(function(d){
	return d.produit+d.distanceMoyenne
}).attr("x", function(d,i){
	return i*20;
}).attr("y", function(d){
	return height-d.distanceMoyenne;
}).attr("font-size","11px").attr("fill","white");
});
