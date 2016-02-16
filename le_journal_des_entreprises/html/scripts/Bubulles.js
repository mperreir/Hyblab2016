"use strict";
//Données 
var ugo_nom_projet = ["HUSO", "Kalelithos Invest", "Canibal", "Novolyse", "Flashgap", "Ween", "Poietis", "Numa", "Moulin de Mourlasse", "Capelli"];

var ugo_plateforme = ["Wiseed", "Anaxago", "SmartAngels", "Anaxago", "Anaxago", "SmartAngels", "Wiseed", "SmartAngels", "Bulb In Town", "Wiseed"];

var ugo_fonds = [4300000, 1843628, 1701878, 1492266, 1430471, 1211568, 1200000, 1058500, 1000000, 1000000];

var ugo_fonds_plateforme = [948000, 0, 500000, 900000, 600000, 620000, 0, 944000, 0, 0];

var ugo_description = ["La société Huso, par le biais de la ugo_plateforme Wiseed a réussi à lever 948 000 € (4M300 € au total) en seulement 20 jours, un véritable succès pour cette jeune entreprise. Huso produit en Périgord son propre caviar, dénommé Caviar de Neuvic, un produit français de très grande qualité. Cette levée de ugo_fonds a permis à l’entreprise Périgourdine de renforcer sa présence en France mais également de se lancer à l’international.", 
				   "Kalelithos Invest, grâce à la ugo_plateforme de financement alternatif Anaxago a réussi à lever plus de 1.8 M d’euros. Cet appel au financement, sous cette forme, est une première en France pour un promoteur immobilier. Cette levée a permis à la société de financer et lancer trois projets sur une durée de trois ans, en Languedoc-Roussillon ainsi qu’à Toulouse.",
				   "L’entreprise Canibal a réussi à lever 500000€ de ugo_fonds grâce à la ugo_plateforme SmartAngels. Concept unique au monde et 100% français, Canibal est le seul collecteur à traiter simultanément les 3 types de déchets : bouteilles, canettes et gobelets. La machine se veut ludique et incite au recyclage par le jeu. Au-delà de la prise de conscience écologique, les usagers se voient remettre des coupons de réduction pour les magasins alentours ou des micros-dons pour des associations. Un concept qui rime avec écologie et économie.", 
				   "L’entreprise Novolyze demandait 650 000 euros. La start-up a finalement obtenu au-delà de ses espérances puisqu’elle a récolté 900 000 euros auprès de la communauté d’investisseurs de la ugo_plateforme de crowdfunding Anaxago. Novolyze travaille sur la prévention sanitaire grâce à des germes modèles qualifiés et brevetés, elle augo_ide les entreprises agroalimentaires à maîtriser leurs risques microbiologiques et sanitaires. Cette levée de ugo_fonds permet à l’entreprise de soutenir sa croissance et de se développer davantage à l’internationale, et principalement aux Etats-Unis.",
				   "Flashgap a levé 600000€ sur la ugo_plateforme dédiée aux jeunes PME en recherche de financement, Anaxago. Cette application se veut être à mi-chemin entre Snapchat et les flux de photos d’iCloud. Le principe est assez simple, l’application permet de créer un album photo et d’y inviter les personnes présentes avec vous, ainsi chaque participant prend des clichés via l’application, qui sont alors directement stockés dans l’album crée dans Flashgap. Cependant ce qui fait l’originalité de ce réseau social est que les clichés réalisés disparaissent instantanément après avoir été pris et que ceux-ci ne sont dévoilés que le lendemain seulement, à mugo_idi pile très exactement. Une application qui vous permettra de retrouver la mémoire pour le meilleur… ou pour le pire.",
				   "Après une levée de ugo_fonds réussie de 1,2M€ sur SmartAngels en décembre 2015, la jeune société française Ween, fondée en 2014 et basée à Aix-en-Provence a pu réaliser son objectif de commercialisation en Europe de son thermostat connecté. Ce thermostat connecté à une box a la particularité de réagir en temps réel à différents événements, et notamment à la présence/absence des occupants d’une maison grâce à l’analyse de la position GPS de leur Smartphone (via une technologie dite Smart Time brevetée).",
				   "Poietis, leader Français de la Bioimpression a poursuivi sa croissance en bouclant un premier tour de financement de 2,5M€ incluant une collecte de ugo_fonds record de 1,2M€ en Octobre 2015 sur la ugo_plateforme de financement participatif Wiseed. Les ugo_fonds levés ont pour but l’industrialisation de la technologie de la Bioimpression par Laser et l’arrivée sur le marché des premiers tissus bioimprimés.",
				   "Le 5 juin 2015, NUMA, l'acteur emblématique de l'écosystème numérique français a clôturé sa campagne de crowdfunding #YesWeCrowd sur SmartAngels d'un montant de 1M€ collectés en 6 semaines auprès de plus de 300 investisseurs. Cette opération va permettre à Numa, dans les années à venir, l’ouverture de 15 Numa dans des écosystèmes en voie de structuration et l’accélération de plus de 700 startups. ",
				   "La société CEM, propriétaire de 15 centrales hydroélectriques et spécialiste en électricité industrielle, a bouclé début décembre 2015 une campagne d’un million d’euros sur la ugo_plateforme de crowdfunding consacré aux projets locaux, Bulb in Town. L’objectif de cette campagne étant la construction d’une centrale hydroélectrique en Ariège.",
				   "En Mars 2015, le promoteur immobilier Capelli s’est lancé dans crowdfunding. Un bon moyen pour les investisseurs particuliers de participer au financement d’un projet immobilier."
];

//Tableau de définition des tailles, positions et couleurs des bulles
var ugo_data = [
    {"x":800,"y":100,"r":75,"color":"#CC9E53","name":ugo_nom_projet[0],"ugo_id":0,"funds":ugo_fonds[0],"descr":ugo_description[0]},
    {"x":150,"y":120,"r":ugo_fonds[1]/20000,"color":"#879BA8","name":ugo_nom_projet[1],"ugo_id":1,"funds":ugo_fonds[1],"descr":ugo_description[1]},
    {"x":400,"y":300,"r":ugo_fonds[2]/20000,"color":"#0B2D4F","name":ugo_nom_projet[2],"ugo_id":2,"funds":ugo_fonds[2],"descr":ugo_description[2]},
    {"x":150,"y":400,"r":ugo_fonds[3]/20000,"color":"#879BA8","name":ugo_nom_projet[3],"ugo_id":3,"funds":ugo_fonds[3],"descr":ugo_description[3]},
    {"x":320,"y":110,"r":ugo_fonds[4]/20000,"color":"#879BA8","name":ugo_nom_projet[4],"ugo_id":4,"funds":ugo_fonds[4],"descr":ugo_description[4]},
    {"x":70,"y":250,"r":ugo_fonds[5]/20000,"color":"#0B2D4F","name":ugo_nom_projet[5],"ugo_id":5,"funds":ugo_fonds[5],"descr":ugo_description[5]},
    {"x":280,"y":450,"r":ugo_fonds[6]/20000,"color":"#0D2131","name":ugo_nom_projet[6],"ugo_id":6,"funds":ugo_fonds[6],"descr":ugo_description[6]},
    {"x":200,"y":280,"r":ugo_fonds[7]/20000,"color":"#0B2D4F","name":ugo_nom_projet[7],"ugo_id":7,"funds":ugo_fonds[7],"descr":ugo_description[7]},
    {"x":480,"y":150,"r":ugo_fonds[8]/20000,"color":"#113D6F","name":ugo_nom_projet[8],"ugo_id":8,"funds":ugo_fonds[8],"descr":ugo_description[8]},
    {"x":50,"y":480,"r":ugo_fonds[9]/20000,"color":"#0D2131","name":ugo_nom_projet[9],"ugo_id":9,"funds":ugo_fonds[9],"descr":ugo_description[9]}
];

//Fonction d'affichage des infos sur la bulle sélectionnée
function display(ugo_id) {
	d3.select("#titre").text(function() {return ugo_nom_projet[ugo_id]});
	d3.select("#fonds_leves").text(function() {return ugo_fonds[ugo_id] + " €"});
	d3.select("#nom").text(function() {return ugo_nom_projet[ugo_id]});
	d3.select("#plateforme").text(function() {return "Plateforme : " + ugo_plateforme[ugo_id]});
	d3.select("#fonds").text(function() {return "Fonds levés pour ce projet : " + ugo_fonds[ugo_id] + "€"});
	d3.select("#fonds_plateforme").text(function() {
		if(ugo_fonds_plateforme[ugo_id]!=0) {
			return "Fonds levés sur la plateforme : " + ugo_fonds_plateforme[ugo_id] + "€";
		}
		else {
			return "Fonds levés sur la Plateforme : Non communiqué ";
		}
	});
	d3.select("#description").text(function() {return "Description du projet : " + ugo_description[ugo_id]});
}

//Fonction de suppression du contenu de la bulle
function deDisplay() {
		var p;
		p = document.querySelector("#contenu #titre");
		while (p.firstChild) {
			p.removeChild(p.firstChild);
		}
		p = document.querySelector("#contenu #fonds_leves");
		while (p.firstChild) {
			p.removeChild(p.firstChild);
		}
}

//Fonction de gestion de la taille des bulles
function growCircle() {
	//Avant de changer la taille de la bulle sélectionnée, on réinitialise la taille de toutes les autres
	d3.selectAll("circle").transition()
		.duration(500)
		.attr("r", function(d) {return d.r});
	//On réaffiche les autres bulles et leur texte
	d3.selectAll("circle").transition()
		.style("opacity", 1)
		//On replace toutes les autres bulles à leur emplacement original
		.attr("transform", function(d) {
			return "translate (" + 0 + "," + 0 + ")";
	})
	d3.selectAll(".node").selectAll("text").transition()
	.style("opacity", 1);
	//Si la bulle est déjà grossie, on la réinitialise
	if(d3.select(this).attr("increased") == "true") {
		//Avant de changer la taille de la bulle sélectionnée, on réinitialise la taille de toutes les autres
		d3.selectAll("circle").transition()
			.duration(500)
			.attr("r", function(d) {return d.r});
		//Animation de réduction et de replacement
		d3.select(this).transition()
			.duration(500)
			.attr("r", function(d) {return d.r})
			.attr("increased","false")
			.attr("transform", function(d) {
			return "translate (" + 0 + "," + 0 + ")";
		});
		//Suppression du contenu de la bulle
		deDisplay();
	}
	//Sinon, on la grossit
	else {
		//On réduit toutes les autres bulles
		d3.selectAll("circle").transition()
			.duration(200)
			.attr("r", 0);
		
		//On rend tous les textes des bulles transparents
		d3.selectAll(".node").selectAll("text").transition()
			.style("opacity", 0);
		
		//Animation de grossissement
		d3.select(this).transition()
			.duration(500)
			.attr("r", 240)
			//Mouvement vers la position d'affichage
			.attr("transform", function(d) {
				return "translate (" + (0 - d.x + 250) + "," + (0 - d.y + 290) + ")";
			})
			.style("opacity",1) //Au cas où on aurait cliqué sur une bulle rendue transparente, on la rend de nouveau opaque
			
		d3.select(this).attr("increased", "true")
		
		//Affichage des éléments
		var ugo_id = d3.select(this).attr("ugo_id")
		display(ugo_id);
	}
}

//Fonction de changement d'onglet (non fonctionelle)
/*function clicButton() {
	d3.select("bubulles").style("display", "none");
	//d3.select("video").style("display", "inline-block");
}*/

//Taille de la fenêtre
var maxWidth = 950;
var maxHeight = 600;

//Déclaration de svg et de la taille du canvas
var svg = d3.select("#bubulles").append("svg")
	.style("width", maxWidth)
	.style("height", maxHeight);

//Déclaration des points, puis translation jusqu'à leur position finale
var nodes = svg.selectAll(".node")
   .data(ugo_data)
   .enter()
     .append("g")
     .attr("class","node")
     .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"; });

//Déclaration des bulles au dessus de chaque point
nodes.append("circle")
     .attr("r", function(d){return d.r})
     .style("fill",function(d){return d.color;})
	 .attr("increased", "false")
	 .attr("preserveAspectRatio", "xMugo_idYMugo_id meet")
	 .attr("viewBox", "0 0 " + maxWidth + " " + maxHeight)
	 .attr("ugo_id", function(d){return d.ugo_id;})
	 .on("click", growCircle)
	 //Légère réduction de l'opacité au passage de la souris
	 .on("mouseover", function() {
	 	d3.select(this).style("opacity", 0.8);
	 })
	 //Réinitialisation de l'opacité quand la souris s'éloigne
	 .on("mouseleave", function() {
	 	d3.select(this).style("opacity", 1);
	 });

//Déclaration du texte des bulles
nodes.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.name; });

var base = d3.select("#vis");