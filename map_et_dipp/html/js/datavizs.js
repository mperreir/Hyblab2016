"use strict";


var produits = [ {"produit":"Légumes","distanceMoyenne":9999, "distMin":9999, "distMax":0,"img":"pictoLégumes.png"},
  {"produit":"Fruits", "distanceMoyenne":9999, "distMin":9999, "distMax":0,"img":"pictoFruits.png"},
  {"produit": "Produits Laitiers","distanceMoyenne":9999, "distMin":9999, "distMax":0,"img":"pictoProduits Laitiers.png"},
  {"produit": "Viande","distanceMoyenne":9999, "distMin":9999, "distMax":0,"img":"pictoViande.png"},
  {"produit": "Miel","distanceMoyenne":9999, "distMin":9999, "distMax":0,"img":"pictoMiel.png"},
  {"produit": "Autres","distanceMoyenne":9999, "distMin":9999, "distMax":0,"img":"pictoAutres.png"}];

var produitsDebut = [ {"produit":"Légumes","distanceMoyenne":0, "distMin":0, "distMax":0},
  {"produit":"Fruits", "distanceMoyenne":0, "distMin":0, "distMax":0},
  {"produit": "Produits Laitiers","distanceMoyenne":0, "distMin":0, "distMax":0},
  {"produit": "Viande","distanceMoyenne":0, "distMin":0, "distMax":0},
  {"produit": "Miel","distanceMoyenne":0, "distMin":0, "distMax":0},
  {"produit": "Autres","distanceMoyenne":0, "distMin":0, "distMax":0}];

var villes = [{"nom":"Angers", "distance":82}, {"nom":"Laval","distance":138}];
var quartiers = [{"nom":"Malakoff St Donatien", "produits":[]}, {"nom":"Doulon Bottière"}, {"nom":"Hauts Pavés St Félix"}, {"nom":"Bellevue Chantenay"}
, {"nom":"Centre Ville"}, {"nom":"Nantes Nord"}, {"nom":"Ile de Nantes"}, {"nom":"Nantes Erdre"}, {"nom":"Nantes Sud"}, {"nom":"Breil Barberie"}];
var wahoo = [{"nom":"Moyenne nationale", "distance":2494}];




/**
 * Retourne la distance en kilomètres entre deux points géographiques
 * @param   {number} lat1 latitude du premier point géographique
 * @param   {number} lon1 longitude du premier point géographique
 * @param   {number} lat2 latitude du second point géographique
 * @param   {number} lon2 longitutude du second point géographique
 */
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

$.getJSON('./json/donneesAMAPSProducteurs.js', function(data){ 
	dataset = data; 




// Calcul et enregistrement des des distances entre les AMAPS et les producteurs
//	distances min,moyenne et max
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

// ####################################################
// ####################################################

//radius du rond au centre de l'image
var nantesRadius = [30];
var width = 650;
var height = 600;
//ratio d'échelle du svg
var ratio = 1.3;

// constantes de la datavisualisation
var widthAside = 350;
var heightAside = 170;
var couleurLigneMin = "#38615a";
var couleurLigneMoy = "#80cbc4";
var couleurLigneMax = "#adf0c3";

//définition des images svg
var svg = d3.select("#araigneeAMAP").append("svg").attr("width",width).attr("height",height).attr("viewBox","0, 0, 650, 600").attr("preserveAspectRatio", "xMinYMin");
// on enregistre le svg dans la variable globale d3 pour pouvoir y appliquer des transformations dans un autre scope
d3.www = svg;
var svgAside = d3.select("#legendeAraignee").append("svg").attr("width",widthAside).attr("height",heightAside).attr("id","svgAside");

//DESSIN du cercle représentant nantes
svg.selectAll("circle").data(nantesRadius).enter().append("circle").attr("cx", width/2).attr("cy",height/2).attr("r",nantesRadius).attr("fill","teal");

//définition de groupes dans le svg pour appliquer des attributs communs
var groupes = svg.selectAll("g").data(produitsDebut).enter();
var pictoAside = svgAside.selectAll("g").data(wahoo).enter();

var echelle = svg.selectAll("g").data(villes).enter();
var gmoscou = svg.selectAll("g").data(wahoo).enter();


//tooltip au survol des distances
var tooltip = d3.select("#araigneeAMAP").append("div").attr("class","dataTooltip");//style("background-color","black").style("position","absolute").style("z-index","100000").style("visibility","hidden").text("simple tooltip");



// #################################################################//
//				DESSIN DES LIGNES SELON LES DISTANCES
// #################################################################//
//##### LIGNES MIN
var lignesMin = groupes.append("line").attr("categorie",function(d){return d.produit;}).attr("x1", function(d, i) {
	var x = (width/2) - nantesRadius;
	var y = (height/2);
	var angle = i*(Math.PI*2)/produits.length;
	return rotatePoint(x, y, (width/2), (height/2), angle).x;

}).attr("class","ligneMin").attr("y1", function(d, i) {
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

}).attr("stroke-width",3).attr("stroke",couleurLigneMin).on("mouseover", function(d){
	d3.select(this).attr("stroke","grey");
	tooltip.text("Minimum : "+d.distMin.toFixed(2));
	return tooltip.style("visibility","visible");
}).on("mousemove",function(d){
	return tooltip.style("left",d3.event.pageX+"px").style("top",d3.event.pageY-50+"px");
}).on("mouseout",function(d){
	d3.select(this).attr("stroke",couleurLigneMin);
	return tooltip.style("visibility","hidden");
});
	//mise à jour des lignes min
	svg.selectAll("line.ligneMin").data(produits).transition().duration(4000).delay(150).ease("elastic").attr("x1", function(d, i) {
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
		return rotatePoint(x,y,(width/2), (height/2), angle).x;
	}).attr("y2",function(d,i){
		var x = (width/2) - nantesRadius - (d.distMin*ratio);
		var y = (height/2);
		var angle = i*(Math.PI*2)/produits.length;
		return rotatePoint(x, y, (width/2), (height/2), angle).y;
	});


//##### LIGNES MOYENNES
var lignesMoyenne = groupes.append("line").attr("class","ligneMoy").attr("categorie",function(d){return d.produit;}).attr("x1", function(d, i) {
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
}).attr("stroke-width",3).attr("stroke",couleurLigneMoy).on("mouseover", function(d){
	d3.select(this).attr("stroke","grey");
	tooltip.text("Moyenne : "+d.distanceMoyenne.toFixed(2));
	return tooltip.style("visibility","visible");
}).on("mousemove",function(d){
	return tooltip.style("left",d3.event.pageX+"px").style("top",d3.event.pageY-50+"px");
}).on("mouseout",function(d){
	d3.select(this).attr("stroke",couleurLigneMoy);
	return tooltip.style("visibility","hidden");
});
	//mise à jour des lignes moy
	svg.selectAll("line.ligneMoy").data(produits).transition().duration(4000).delay(150).ease("elastic").attr("x1", function(d, i) {
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
		return rotatePoint(x,y,(width/2), (height/2), angle).x;
	}).attr("y2",function(d,i){
		var x = (width/2) - nantesRadius - (d.distanceMoyenne*ratio);
		var y = (height/2);
		var angle = i*(Math.PI*2)/produits.length;
		return rotatePoint(x, y, (width/2), (height/2), angle).y;
	});

// DESSIN DES LIGNES DES DISTANCES MAX
var lignesMax = groupes.append("line").attr("categorie",function(d){return d.produit;}).attr("class","ligneMax").attr("x1", function(d, i) {
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
	var angle = i*(Math.PI*2)/produits.length;
	d.ymax = rotatePoint(x, y, (width/2), (height/2), angle).y;
	return d.ymax;
}).attr("stroke-width",3).attr("stroke",couleurLigneMax).on("mouseover", function(d){
	d3.select(this).attr("stroke","grey");
	tooltip.text("Maximum : "+d.distMax.toFixed(2));
	return tooltip.style("visibility","visible");
}).on("mousemove",function(d){
	return tooltip.style("left",d3.event.pageX+"px").style("top",d3.event.pageY-50+"px");
}).on("mouseout",function(d){
	d3.select(this).attr("stroke",couleurLigneMax);
	return tooltip.style("visibility","hidden");
}).attr("stroke-dasharray", "5,5");

	//mise à jour des lignes max
	svg.selectAll("line.ligneMax").data(produits).transition().duration(4000).delay(150).ease("elastic").attr("x1", function(d, i) {
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
		return rotatePoint(x,y,(width/2), (height/2), angle).x;
	}).attr("y2",function(d,i){
		var x = (width/2) - nantesRadius - (d.distMax*ratio);
		var y = (height/2);
		var angle = i*(Math.PI*2)/produits.length;
		return rotatePoint(x, y, (width/2), (height/2), angle).y;
	});

// ###########################################################################
// ###########################################################################
// ###########################################################################




// ajout d'une catégorie par défaut 
svgAside.append("svg:image").attr("x",widthAside/4-25).attr("y",40).attr("width",50).attr("height",50).attr("xlink:href","./img/pictoFruits.png");
svgAside.append("text").attr("class","nomCategorie").text("Fruits").attr("x",function(){

	return widthAside/4-24;
}).attr("y",130).attr("fill","#4c4c4c").attr("font-size","20px");
svgAside.append("line").attr("x1", widthAside/2).attr("y1", 35).attr("x2",widthAside/2).attr("y2",135).attr("stroke-width",1).attr("stroke","orange");

svgAside.append("text").attr("x",widthAside-(widthAside/3)-20)
	.attr("y",40)
	.text("MAX")
	.attr("fill",couleurLigneMax)
	.attr("stroke-width","1px");

svgAside.append("text")
	.attr("x",widthAside/2+85)
	.attr("y",40)
	.text("169.71")
	.attr("class","max")
	.attr("font-size","20px")
	.attr("fill","#999999")
	.attr("stroke-width","1px");

svgAside.append("text")
	.attr("x",widthAside-(widthAside/3)-20)
	.attr("y",85)
	.text("MOY")
	.attr("fill","#90d7df")
	.attr("stroke-width","1px");

svgAside.append("text")
	.attr("x",widthAside/2+85)
	.attr("y",85).text("51.08")
	.attr("class","moy")
	.attr("font-size","20px")
	.attr("fill","#999999")
	.attr("stroke-width","1px");

svgAside.append("text")
	.attr("x",widthAside-(widthAside/3)-20)
	.attr("y",130)
	.text("MIN")
	.attr("fill","#4c4c4c")
	.attr("stroke-width","1px");

svgAside.append("text")
	.attr("x",widthAside/2+85)
	.attr("y",130)
	.text("16.98")
	.attr("class","min")
	.attr("font-size","20px")
	.attr("fill","#999999")
	.attr("stroke-width","1px");

//DESSIN DES PICTOS
svg.selectAll("image")
	.data(produits)
	.enter()
	.append("svg:image")
	.attr("x",function(d,i){
		var x = (width/2) - nantesRadius - d.distMax - 70;
		var y = (height/2);
		var angle = i*(Math.PI*2)/produits.length;

		return (rotatePoint(x, y, (width/2), (height/2), angle).x)-30;
	})
	.attr("y",function(d,i){
		var x = (width/2) - nantesRadius - d.distMax - 70;
		var y = (height/2);
		var angle = i*(Math.PI*2)/produits.length;

		return (rotatePoint(x, y, (width/2), (height/2), angle).y)-30;
	})
	.attr("width", 50)
	.attr("height",50)
	.attr("xlink:href",function(d,i){
		return "./img/"+d.img;
	})
	.attr("categorie",function(d){return d.produit;})
	.attr("distMin",function(d){return d.distMin.toFixed(2);})
	.attr("distMoy",function(d){return d.distanceMoyenne.toFixed(2);})
	.attr("distMax",function(d){return d.distMax.toFixed(2);})
	.on("mouseover", function(d){
		$("#texteAvantSurvol").hide();
		$("#svgAside").show();
		d3.select(this).attr("xlink:href", "./img/picto"+d3.select(this).attr("categorie")+"O.png");
		svgAside.selectAll("text.nomCategorie").text(d3.select(this).attr("categorie"));
	
		svgAside.selectAll("text.nomCategorie").attr("x",widthAside/4-(4*(d3.select(this).attr("categorie").length)));

		svgAside.selectAll("text.max").text(d3.select(this).attr("distMax"));
		svgAside.selectAll("text.moy").text(d3.select(this).attr("distMoy"));
		svgAside.selectAll("text.min").text(d3.select(this).attr("distMin"));
		svg.selectAll("line[categorie='"+d3.select(this).attr("categorie")+"']").attr("stroke","grey");

		return svgAside.selectAll("image").attr("xlink:href",d3.select(this).attr("xlink:href"));
	})
	.on("mousemove",function(d){
		//return tooltip.style("left",d3.event.pageX+"px").style("top",d3.event.pageY-50+"px");
	})
	.on("mouseout",function(d){
		d3.select(this).attr("xlink:href", "./img/picto"+d3.select(this).attr("categorie")+".png");
		svg.selectAll("line.ligneMin[categorie='"+d3.select(this).attr("categorie")+"']").attr("stroke",couleurLigneMin);
		svg.selectAll("line.ligneMoy[categorie='"+d3.select(this).attr("categorie")+"']").attr("stroke",couleurLigneMoy);
		svg.selectAll("line.ligneMax[categorie='"+d3.select(this).attr("categorie")+"']").attr("stroke",couleurLigneMax);
		//d3.select(this).attr("stroke","#adf0c3");
		//return tooltip.style("visibility","hidden");
	});




var villesDistances = echelle.append("circle").attr("cx",width/2).attr("cy",height/2).attr("r",function(d){
	return d.distance;
}).attr("fill","none").attr("stroke","grey").attr("stroke-width",1).attr("stroke-dasharray", "5,5");
var villesNoms = echelle.append("text").attr("x",(width/2)-15).attr("y",function(d){
	return height/2-d.distance-5;
}).attr("font-size","10px").attr("fill","grey").text(function(d){return d.nom;});

var moscou = gmoscou.append("circle").attr("cx",width/2).attr("cy",height/2).attr("r",function(d){return d.distance;}).attr("fill","none").attr("stroke","black").attr("stroke-width",4);

//texte dans le cercle
/*
Quinoa, rhum, riz ... Ces produits parcourent en moyenne 9000 km jusqu'à notre assiette !
*/
gmoscou.append("text").attr("x",(width/2)-750).attr("y",-1650).text("Quinoa, rhum, riz ...").attr("font-size","150px");
gmoscou.append("text").attr("x",(width/2)-1200).attr("y",-1500).text("Ces produits parcourent 9000 km").attr("font-size","150px");
gmoscou.append("text").attr("x",(width/2)-1200).attr("y",-1350).text("jusqu'à notre assiette !").attr("font-size","150px");


gmoscou.append("text").attr("x",-2000).attr("y",-2000).text("Revenir à Nantes").attr("font-size","100px").on("click",function(){
	return svg.transition().attr("transform","scale(1) translate("+(0-(width/1000))+","+(0-(height/1000))+")").ease("linear").duration(1000).delay(100);
});
});