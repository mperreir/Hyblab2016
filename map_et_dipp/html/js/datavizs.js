"use strict";


var produits = [ {"produit":"Légumes","distanceMoyenne":9999, "distMin":9999, "distMax":0},
  {"produit":"Fruits", "distanceMoyenne":9999, "distMin":9999, "distMax":0},
  {"produit": "Produits Laitiers","distanceMoyenne":9999, "distMin":9999, "distMax":0},
  {"produit": "Viande","distanceMoyenne":9999, "distMin":9999, "distMax":0},
  {"produit": "Miel","distanceMoyenne":9999, "distMin":9999, "distMax":0},
  {"produit": "Autres","distanceMoyenne":9999, "distMin":9999, "distMax":0}];

var villes = [{"nom":"Angers", "distance":82}, {"nom":"Laval","distance":138}];
var quartiers = [{"nom":"Malakoff St Donatien", "produits":[]}, {"nom":"Doulon Bottière"}, {"nom":"Hauts Pavés St Félix"}, {"nom":"Bellevue Chantenay"}
, {"nom":"Centre Ville"}, {"nom":"Nantes Nord"}, {"nom":"Ile de Nantes"}, {"nom":"Nantes Erdre"}, {"nom":"Nantes Sud"}, {"nom":"Breil Barberie"}];




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


//récupération des données
var dataset;

$.getJSON('./js/donneesAMAPSProducteurs.js', function(data){ 
	dataset = data; 




//établissement des distances min,moy et max entre les amaps/producteurs
dataset.forEach(function (d) {
	d.Distance = getDistanceFromLatLonInKm(d.LATProd, d.LONGProd, d.LATAMAP, d.LONGAMAP);
});

var s=-1;
var qte = -1;
var moy = -1;

var lesp = [];
/*quartiers.forEach(function(q){
	q.produits = [];
	produits.forEach(function(p){
		q.produits.push({"nom":p.produit, "min":9999,"max":0,"moy":9999});
		dataset.forEach(function(d){
			if(d.Produits == p.produit && )
		});
	});
});*/

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



var nantesRadius = [30];
var width = 650;
var height = 650;
var ratio = 1.3;

var svg = d3.select("#araigneeAMAP").append("svg").attr("width",width).attr("height",height);

//DESSIN du cercle représentant nantes
svg.selectAll("circle").data(nantesRadius).enter().append("circle").attr("cx", width/2).attr("cy",height/2).attr("r",nantesRadius).attr("fill","teal");
//svg.selectAll("image").data(nantesRadius).enter().append("svg:image").attr("x",(width/2)-(150/2)).attr("y",(height/2)-(150/2)).attr("width", 150).attr("height",150).attr("xlink:href","../img/nantesRond.png");


var groupes = svg.selectAll("g").data(produits).enter();
var echelle = svg.selectAll("g").data(villes).enter();

var triangles = svg.selectAll("g").data(produits).enter();

var angleActuMax = 0;
var angleActuMoy = 0;
var angleActuMin = 0;

var tooltip = d3.select("#araigneeAMAP").append("div").attr("class","dataTooltip");//style("background-color","black").style("position","absolute").style("z-index","100000").style("visibility","hidden").text("simple tooltip");


// DESSIN DES LIGNES DES DISTANCES
var lignesMax = groupes.append("line").attr("x1", function(d, i) {
	var x = (width/2) - nantesRadius-(d.distanceMoyenne*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y1", function(d, i) {
	var x = (width/2) - nantesRadius-(d.distanceMoyenne*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("x2",function(d,i){
	var x = (width/2) - nantesRadius - (d.distMax*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	d.xmax = rotatePoint(x,y,(width/2), (height/2), angle).x;
	return d.xmax;
}).attr("y2",function(d,i){
	var x = (width/2) - nantesRadius - (d.distMax*ratio);
	var y = (height/2);
	//var angle = 360 * i / produits.length;
	var angle = i*(Math.PI*2)/produits.length;
	d.ymax = rotatePoint(x, y, (width/2), (height/2), angle).y;
	return d.ymax;
}).attr("stroke-width",1).attr("stroke","black").on("mouseover", function(d){
	d3.select(this).attr("stroke","grey");
	tooltip.text("Maximum : "+d.distMax.toFixed(2));
	return tooltip.style("visibility","visible");
}).on("mousemove",function(d){
	return tooltip.style("left",d3.event.pageX+"px").style("top",d3.event.pageY-50+"px");
}).on("mouseout",function(d){
	d3.select(this).attr("stroke","black");
	return tooltip.style("visibility","hidden");
});



//bout de ligne qui dépasse après le max
var lignesApresMax = groupes.append("line").attr("x1", function(d, i) {
	var x = (width/2) - nantesRadius-(d.distMax*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;

}).attr("y1", function(d, i) {
	var x = (width/2) - nantesRadius-(d.distMax*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;

	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("x2",function(d,i){
	var x = (width/2) - nantesRadius - (d.distMax*ratio)-20;
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y2",function(d,i){
	var x = (width/2) - nantesRadius - (d.distMax*ratio)-20;
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("stroke-width",1).attr("stroke","black");

//##### LIGNES MOYENNES
var lignesMoyenne = groupes.append("line").attr("x1", function(d, i) {
	var x = (width/2) - nantesRadius-(d.distMin*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;

}).attr("y1", function(d, i) {
	var x = (width/2) - nantesRadius-(d.distMin*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("x2",function(d,i){
var x = (width/2) - nantesRadius - (d.distanceMoyenne*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("y2",function(d,i){
	var x = (width/2) - nantesRadius - (d.distanceMoyenne*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("stroke-width",1).attr("stroke","black").on("mouseover", function(d){
	d3.select(this).attr("stroke","grey");
	tooltip.text("Moyenne : "+d.distanceMoyenne.toFixed(2));
	return tooltip.style("visibility","visible");
}).on("mousemove",function(d){
	return tooltip.style("left",d3.event.pageX+"px").style("top",d3.event.pageY-50+"px");
}).on("mouseout",function(d){
	d3.select(this).attr("stroke","black");
	return tooltip.style("visibility","hidden");
});





//##### LIGNES MIN
var lignesMin = groupes.append("line").attr("x1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;

}).attr("y1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;

}).attr("x2",function(d,i){
	var x = (width/2) - nantesRadius - (d.distMin*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;

}).attr("y2",function(d,i){
	var x = (width/2) - nantesRadius - (d.distMin*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;

}).attr("stroke-width",1).attr("stroke","black").on("mouseover", function(d){
	d3.select(this).attr("stroke","grey");
	tooltip.text("Minimum : "+d.distMin.toFixed(2));
	return tooltip.style("visibility","visible");


}).on("mousemove",function(d){
	
	return tooltip.style("left",d3.event.pageX+"px").style("top",d3.event.pageY-50+"px");
}).on("mouseout",function(d){
	d3.select(this).attr("stroke","black");
	return tooltip.style("visibility","hidden");
});



// DESSIN DU TEXTE
svg.selectAll("image").data(produits).enter()
.append("svg:image").attr("x",function(d,i){
	var angle = i*(Math.PI*2)/produits.length;

	return d.xmax+20;
}).
attr("y",function(d,i){
	var angle = i*(Math.PI*2)/produits.length;
	if(angle == Math.PI || angle == 0)
		d.ymax -= 45;

	return d.ymax;
}).attr("width", 30).attr("height",30).attr("xlink:href",function(d,i){
	return "../img/picto"+i+".png";
});

svg.selectAll("text").data(produits).enter().append("text").text("changer l'échelle").attr("x",0).attr("y",100).on("click",function(){
	return svg.transition().attr("transform","scale(0.2)").ease("linear").duration(1000).delay(100);
});

//dessin des triangles :)
var trianglesMax = triangles.append("polyline").style("stroke","#fecccb").style("fill","#fecccb").attr("points",function(d,i){
	var x1,y1,x2,y2,x3,y3,pointx1,pointx2,pointx3,pointy1,pointy2,pointy3;
	//utilisable : d.xmax et y.xmax les coords du point représentant la distance max+20
	
    var x = (width/2) - nantesRadius - (d.distMax*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;

	x1 = x;
	y1 = y-10;

	x2 = x;
	y2 = y+10;

	x3 = x+10;
	y3 = y;

	pointx1 = rotatePoint(x1, y1, (width/2), (height/2), angle).x;
	pointy1 = rotatePoint(x1, y1, (width/2), (height/2), angle).y;

	pointx2 = rotatePoint(x2, y2, (width/2), (height/2), angle).x;
	pointy2 = rotatePoint(x2, y2, (width/2), (height/2), angle).y;

	pointx3 = rotatePoint(x3, y3, (width/2), (height/2), angle).x;
	pointy3 = rotatePoint(x3, y3, (width/2), (height/2), angle).y;

	return pointx1+","+pointy1+", "+pointx2+","+pointy2+", "+pointx3+","+pointy3;
});
var trianglesMin = triangles.append("polyline").style("stroke","#addfeb").style("fill","#addfeb").attr("points",function(d,i){
	var x1,y1,x2,y2,x3,y3,pointx1,pointx2,pointx3,pointy1,pointy2,pointy3;
	//utilisable : d.xmax et y.xmax les coords du point représentant la distance max+20
	
    var x = (width/2) - nantesRadius - ((d.distMin)*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;

	x1 = x;
	y1 = y-10;

	x2 = x;
	y2 = y+10;

	x3 = x-10;
	y3 = y;

	pointx1 = rotatePoint(x1, y1, (width/2), (height/2), angle).x;
	pointy1 = rotatePoint(x1, y1, (width/2), (height/2), angle).y;

	pointx2 = rotatePoint(x2, y2, (width/2), (height/2), angle).x;
	pointy2 = rotatePoint(x2, y2, (width/2), (height/2), angle).y;

	pointx3 = rotatePoint(x3, y3, (width/2), (height/2), angle).x;
	pointy3 = rotatePoint(x3, y3, (width/2), (height/2), angle).y;

	return pointx1+","+pointy1+", "+pointx2+","+pointy2+", "+pointx3+","+pointy3;
});
//##########################################################################


// ######### DESSIN DES CERCLES

var pointsMoy = groupes.append("circle").attr("cx", function(d, i) {
    var x = (width/2) - nantesRadius - (d.distanceMoyenne*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;
}).attr("cy", function(d, i) {
    var x = (width/2) - nantesRadius - (d.distanceMoyenne*ratio);
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).y;
}).attr("r", 3).attr("fill","black");



var villesDistances = echelle.append("circle").attr("cx",width/2).attr("cy",height/2).attr("r",function(d){
	return d.distance;
}).attr("fill","none").attr("stroke","black").attr("stroke-width",1).attr("stroke-dasharray", "5,5");
var villesNoms = echelle.append("text").attr("x",width/2).attr("y",function(d){
	return height/2-d.distance-5;
}).text(function(d){return d.nom;});

});