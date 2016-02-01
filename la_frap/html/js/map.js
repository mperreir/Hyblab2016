"use strict";

window.addEventListener('load', function () {

	$(document).ready(function () {
		$('#bigmap').vectorMap({
			map:'pays_de_la_loire_king_size',
			backgroundColor: 'none',
			color:'#003f4e',
			selectedColor:'#003f4e',
			hoverColor:'#006f7e',
			series:{
				regions:[{
					attribute:'fill', 
				}]
			},

		});

		$('#bigmap').css("background-color","rgba(0,0,0,0)");

		
	});
	
	$(document).ready(function () {
		$('#map').vectorMap({
			map:'pays_de_la_loire',
			backgroundColor: 'none',
			color:'#003f4e',
			selectedColor:'#179fae',
			hoverColor:'#006f7e',
			series:{
				regions:[{
					attribute:'fill', 
				}]
			},
			selectedRegion: "FR-44",

		});

		//map.series.regions[0].setValues("#179fae");
		/*console.log($('#map').selectedRegions);
        var map = $('#map').vectorMap('get', 'mapObject');	
        map.setSelectedRegions("FR-44");
        console.log($('#map').selectedRegions);
		$('#map').css("background-color","rgba(0,0,0,0)");*/
		//$('path g svg p div').attr("fill","#179fae");

		
	});

    var map = document.getElementById('map');
    map.firstChild.setAttribute("id", "pdll");
    var markersContainer = d3.select("#pdll").append("g");

    var pdll = document.getElementById('pdll');
    pdll.firstChild.setAttribute("id", "carte");
    pdll.firstChild.nextSibling.setAttribute("id", "points");

    //d3.select("#carte").selectAll("path").attr("fill","#179fae");

	//document.querySelector("#carte").setAttribute("transform","scale(1.5), translate(-50,0)");

	var jsonDptInfo = [
		{"n":"LA VENDEE","num":"85","r":4,"s":18,"b":181,"sc":0},				
		{"n":"LA LOIRE ATLANTIQUE","num":"44","r":11,"s":57,"b":738,"sc":7},
		{"n":"LE MAINE ET LOIRE","num":"49","r":4,"s":16,"b":311,"sc":3},
		{"n":"LA MAYENNE","num":"53","r":2,"s":9,"b":117,"sc":2},
		{"n":"LA SARTHE","num":"72","r":1,"s":7,"b":60,"sc":0}


	]

	var dpt = d3.select("#carte").selectAll("path")
							  .data(jsonDptInfo);
	var info = d3.select("#infodpt");
	
	dpt.on('click', function (d){
		d3.select("#nomdpt").html("<img src=img/loc_26.png> " + d.n + "<span> " + d.num +"</span>");
		info.style("visibility" ,"visible");
		info.html("<h1>En quelques chiffres</h1><div><p class=\"chiffre\">" + d.r + "</p> <img src=img/Radio_26-01.png> Radios fédérées</div><p><span>" + d.s + "</span> <img src=img/Perso_26-01.png> Salariés</p><p><span>" + d.b + "</span> <img src=img/Perso_26-01.png> Bénévoles</p><p><span>" + d.sc + "</span> <img src=img/Perso_26-01.png> Services Civiques</p>");
	});


	var jsonMarker = [
		{"x":134.716,"y":330.95,"r":3.492,"c":"white","nom":"RCF Vendée","texte":"RCF est  une radio chrétienne locale d’information et de culture qui couvre l’ensemble de la Vendée."},
		{"x":142.93,"y":322.737,"r":3.492,"c":"white","nom":"Graffiti Urban","texte":"Graffiti Urban Radio constitue un véritable forum de libre expression pour la population locale, grâce à la diffusion quotidienne de programmes animés par ses habitants bénévoles et sa politique d'accessibilité à l'antenne."},
		{"x":26.323,"y":330.95,"r":3.492,"c":"white","nom":"Neptune FM","texte":"Neptune FM, émettant de l’Ile D’Yeu, propose une programmation pop/rock axée sur la nouvelle scène francophone, les nouveautés internationales et les classiques du genre mais ne néglige pas pour autant les autres styles musicaux."},
		{"x":67.387,"y":297.277,"r":3.492,"c":"white","nom":"Nov FM","texte":" Nov FM dispose depuis 10 ans du même leitmotiv : valoriser tous les acteurs locaux tant par le tissu associatif que la vie économique."},
		{"x":41.635,"y":222.281,"r":3.492,"c":"white","nom":"La Tribu","texte":"La Tribu n’est pas qu’une radio c’est aussi un atelier jeunesse. L’équipe de la radio est mixte, composée d’animateurs jeunesse et de journalistes, permettant ainsi d’offrir aux collégiens et lycéens un espace de parole quotidien."},
		{"x":110.455,"y":186.125,"r":3.492,"c":"white","nom":"Atlantis FM","texte":"Atlantis FM diffuse un concept exclusif à destination des 20-60 ans, étudiants, demandeurs d'emploi comme actifs avec une thématique antenne sur l’emploi, la formation et le développement économique local."},
		{"x":58.95,"y":260.654,"r":3.492,"c":"white","nom":"Radio Chrono","texte":"Radio associative créée en 1981, Radio Chrono permet à ses auditeurs de découvrir des artistes locaux, peu ou pas diffusés sur les radios commerciales. Généraliste, elle est orientée vers la vie locale et associative du Pays de Retz et du Nord Vendée."},
		{"x":101.524,"y":223.309,"r":3.492,"c":"white","nom":"Euradionantes","texte":"Euradionantes, c’est l’actualité européenne à plusieurs voix, en plusieurs langues avec un son résolument européen et un credo : l’info locale européenne."},
		{"x":109.123,"y":229.881,"r":3.492,"c":"white","nom":"Radio Prun'","texte":"Prun’ est la radio jeune faite par 250 bénévoles, pour tous. Au programme : musique, culture, société, politique, sciences, web… Toutes les thématiques sont abordées pour plaire au plus grand nombre."},
		{"x":116.481,"y":265.727,"r":3.492,"c":"white","nom":"NTI","texte":"NTI est une radio associative musicale qui se consacre aux sons « mix  et  dance »."},
		{"x":120.008,"y":230.087,"r":3.492,"c":"white","nom":"SUN","texte":"SUN est une radio locale qui s’adresse à tous les habitants de Nantes et sa région. Elle s’engage à faire vivre les grands événements nantais et propose une programmation musicale éclectique et de l’information avec une forte implication locale."},
		{"x":115.487,"y":219.817,"r":3.492,"c":"white","nom":"Jet FM","texte":"Jet FM propose une antenne locale éclectique, passionnée, exigeante, engagée, militante et ouverte avec au programme de la musique en tous genres sélectionnées hors des autoroutes commerciales et sur les petits chemins de la créativité."},
		{"x":99.538,"y":237.479,"r":3.492,"c":"white","nom":"Fidelité","texte":"Fidelité est une radio chrétienne qui produit et diffuse des reportages et des émissions réalisés dans tous les domaines de la société, qui informent sur les événements locaux, petits et grands. "},
		{"x":110.766,"y":240.15,"r":3.492,"c":"white","nom":"AlterNantes","texte":"Radio pluraliste, humaniste et multilingue, Alternantes FM lutte contre toute forme d’exclusion,  d’intolérance et de racisme. Son antenne offre un moyen d’expression à celles et ceux qui souhaitent promouvoir leurs projets et actions."},
		{"x":238.695,"y":197.208,"r":3.492,"c":"white","nom":"Radio G!","texte":"Radio G! est une radio de proximité guidée par la diversité et l'ouverture d'esprit. Sa grille des programmes regroupe plus d'une cinquantaine d'émissions, musicales ou thématiques, animées par une centaine de bénévoles de tous âges et de tous horizons."},
		{"x":248.007,"y":200.7,"r":3.492,"c":"white","nom":"Radio Campus","texte":"Radio Campus Angers se fait l’écho du monde étudiant angevin en proposant de l’information, de la culture et de la musique pour tous les goûts mais toujours au cœur de l’actualité."},
		{"x":240.615,"y":208.913,"r":3.492,"c":"white","nom":"RCF Anjou","texte":"RCF Anjou est une radio chrétienne locale généraliste, elle diffuse 24h/24 des émissions dont les thèmes sont très variés : information, musique, culture et reportages."},
		{"x":327.673,"y":199.878,"r":3.492,"c":"white","nom":"RPSFM","texte":"RPSFM est une radio musicale rurale qui propose aux auditeurs des programmes qui se démarquent, au-delà de toutes idéologies."},
		{"x":232.514,"y":138.131,"r":3.492,"c":"white","nom":"L'Autre Radio","texte":"L'Autre Radio offre une alternative aux auditeurs grâce à une programmation éclectique et novatrice. Elle se fait entendre avec une programmation musicale de qualité et de l'information internationale, nationale  et locale dans des émissions quotidiennes."},
		{"x":248.007,"y":47.732,"r":3.492,"c":"white","nom":"Fidelité Mayenne","texte":"Fidélité Mayenne radio se met au service des associations, des groupements mais aussi des mouvements de l’église locale, particulièrement attentive aux plus démunis."},
		{"x":337.444,"y":103.58,"r":3.492,"c":"white","nom":"RCF Le Mans","texte":"RCF Le Mans est une radio locale, généraliste et chrétienne  destinée à un public très large, quelles que soient ses convictions."}

	];

	var markers = markersContainer.selectAll("circle")
										.data(jsonMarker)
										.enter()
										.append("circle");

	var div = d3.select("#tooltip");
				

	var markerAttributes = markers
           .attr("cx", function (d) {return d.x;})
           .attr("cy", function (d) {return d.y;})
           .attr("r", function (d) {return d.r;})
           .on("mouseover", function (d) {
           		d.c = "#ff2800";
           		d.r = 4.8;
           		markers.attr("r", function (d) {return d.r;})
					   .style("fill", function (d) {return d.c;});
           })
           /*.on("click", function (d) {
           		div.html(d.texte)
           		   .style("left",(d3.event.pageX) + "px")
           		   .style("top",(d3.event.pageY+10) + "px")
           		   .style("visibility","visible");
           })*/
		   .on("click", function (d) {
		   		div.html("<h1>"+d.nom+"</h1>"+"<p>"+d.texte+"</p>")
		   		   .style("visibility","visible");

		   })
           .on("mouseout", function (d) {
           		div.style("visibility","hidden");
           		d.c = "white";
           		d.r = 3.492;
           		markers.attr("r", function (d) {return d.r;})
           			   .style("fill", function (d) {return d.c;});
           })
           .style("fill", function (d) {return d.c;}
           );
      });