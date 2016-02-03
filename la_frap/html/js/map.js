"use strict";

window.addEventListener('load', function () {


	$(document).ready(function () {
/*	    var map_grande = new jvm.Map({
	        container: $('#bigmap'),
	        map: 'pays_de_la_loire_king_size',
	        regionsSelectable: true,
	        regionsSelectableOne: true,
	        backgroundColor: 'transparent',
	        zoomMax: 1,
	        zoomMin: 1,
	        zoomOnScroll: false,
			color:'#003f4e',
			selectedColor:'#003f4e',
			hoverColor:'#006f7e',
			series:{
				regions:[{
					attribute:'fill', 
				}]
			}
	    });*/

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
			}

		});

		$('#bigmap').css("background-color","rgba(0,0,0,0)");

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




		


		
	
/*	$(document).ready(function () {
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

		});*/

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

	var bigmap = document.getElementById('bigmap');
    bigmap.firstChild.setAttribute("id", "bigpdll");
    var bigpdll = document.getElementById('bigpdll');
    bigpdll.firstChild.setAttribute("id", "bigcarte");





var infofunction = function (d) {
	d3.select("#nomdpt").html("<img src=\"img/Loc_26.png\"> " +	 d.n + "<span> " + d.num +"</span>");
	info.style("visibility" ,"visible");
	d3.select(".radios").select(".chiffre").html(d.r+" ");
	d3.select(".salarie").select(".chiffre").html(d.s+" ");
	d3.select(".benevole").select(".chiffre").html(d.b+" ");
	d3.select(".servicecivique").select(".chiffre").html(d.sc+" ");

	globalpie.updateProp("data.content",d.datapie);

	var svg = d3.select("#pieChartSvg").select("svg");
	var pieData = svg.append("text")
					.attr("id","idPieData")
					.attr("fill", "white")
					.attr("font-size", "30px")
					.attr("text-anchor", "middle")
					.attr("x", "50%")
					.attr("y", "50%")
					.attr("dx", "0px")
					.attr("dy", "10px");
	
	var pieClick = svg.append("text")
					.attr("id","infoselected")
					.attr("fill", "#179fae")
					.attr("font-size", "12px")
					.attr("text-anchor", "middle")
					.attr("x", "50%")
					.attr("y", "70%")
					.text("Cliquez pour afficher les valeurs");

	console.log($("#infoselected"));
	
	d3.select("#pieExplains").style("visibility", "hidden");
}



/*	var jsonDptInfo = [
		{"n":"LA VENDEE","num":"85","id":"#jqvmap2_FR-85","r":4,"s":18,"b":181,"sc":0,"datapie":[{"label":"Subventions","value": 374727,"color":"#ff314f","text":"texte subvention"},{"label":"Aides à l'emploi","value": 4150,"color":"#954fd1","text":"texte aide"},{"label":"Publicité","value":95645,"color":"#004fa9","text":"texte pub"},{"label":"Evenements et ateliers","value": 9996, "color":"#3bbd31", "text":"texte event"},{"label": "Cotisations et dons ","value": 117618,"color": "#00c7e5","text":"texte dons"},{"label": "Autre","value": 79819,"color": "#ff8b1d","text":"texte autre"}]},				
		{"n":"LA LOIRE ATLANTIQUE","num":"44","id":"#jqvmap2_FR-44","r":11,"s":57,"b":738,"sc":7,"datapie":[{"label":"Subventions","value": 968517,"color":"#ff314f","text":"texte subvention"},{"label":"Aides à l'emploi","value": 148239,"color":"#954fd1","text":"texte aide"},{"label":"Publicité","value":98791,"color":"#004fa9","text":"texte pub"},{"label":"Evenements et ateliers","value": 62257, "color":"#3bbd31", "text":"texte event"},{"label": "Cotisations et dons ","value": 38180,"color": "#00c7e5","text":"texte dons"},{"label": "Autre","value": 183222,"color": "#ff8b1d","text":"texte autre"}]},
		{"n":"LE MAINE ET LOIRE","num":"49","id":"#jqvmap2_FR-49","r":4,"s":16,"b":311,"sc":3,"datapie":[{"label":"Subventions","value": 248217,"color":"#ff314f","text":"texte subvention"},{"label":"Aides à l'emploi","value": 44321,"color":"#954fd1","text":"texte aide"},{"label":"Publicité","value":29658,"color":"#004fa9","text":"texte pub"},{"label":"Evenements et ateliers","value": 18690, "color":"#3bbd31", "text":"texte event"},{"label": "Cotisations et dons ","value": 14345,"color": "#00c7e5","text":"texte dons"},{"label": "Autre","value": 122834,"color": "#ff8b1d","text":"texte autre"}]},
		{"n":"LA MAYENNE","num":"53","id":"#jqvmap2_FR-53","r":2,"s":9,"b":117,"sc":2,"datapie":[{"label":"Subventions","value": 108167,"color":"#ff314f","text":"texte subvention"},{"label":"Aides à l'emploi","value": 15665,"color":"#954fd1","text":"texte aide"},{"label":"Publicité","value":10479,"color":"#004fa9","text":"texte pub"},{"label":"Evenements et ateliers","value": 8738, "color":"#3bbd31", "text":"texte event"},{"label": "Cotisations et dons ","value": 38546,"color": "#00c7e5","text":"texte dons"},{"label": "Autre","value": 44683,"color": "#ff8b1d","text":"texte autre"}]},
		{"n":"LA SARTHE","num":"72","id":"#jqvmap2_FR-72","r":1,"s":7,"b":60,"sc":0,"datapie":[{"label":"Subventions","value": 58893,"color":"#ff314f","text":"texte subvention"},{"label":"Aides à l'emploi","value": 0,"color":"#954fd1","text":"texte aide"},{"label":"Publicité","value":2384,"color":"#004fa9","text":"texte pub"},{"label":"Evenements et ateliers","value": 0, "color":"#3bbd31", "text":"texte event"},{"label": "Cotisations et dons ","value": 44623,"color": "#00c7e5","text":"texte dons"},{"label": "Autre","value": 95,"color": "#ff8b1d","text":"texte autre"}]}
	];*/

	var jsonDptInfo = [
		{"n":"LA VENDEE","num":"85","id":"#jqvmap2_FR-85","r":4,"s":18,"b":181,"sc":0,"datapie":[{"label":"Subventions","value": 374727,"color":"#ff314f","text":"Les radios vendéennes ne bénéficient pas de subventions du département. Dans l’ensemble, les radios du département reçoivent en moyenne plus de subventions (30%) que la moyenne régionale. Dans le détail, Nov FM reçoit énormément de subventions des communes par rapport aux autres radios (en moyenne 4 fois plus)."},{"label":"Aides à l'emploi","value": 4150,"color":"#954fd1","text":"Les aides à l’emploi sont les dispositifs de financement partiels mis en place par l’État ou les organismes sociaux  dont les radios associatives peuvent bénéficier."},{"label":"Publicité","value":95645,"color":"#004fa9","text":" Les ressources commerciales provenant de la publicité ou du parrainage doivent être inférieures à 20 % du chiffre d’affaires total des radios associative. Dans l’ensemble, les radios vendéennes sont largement au-dessus de la moyenne régionale (50% de plus) en ce qui concerne la publicité. En détail, les radios du département tirent leurs recettes surtout des M.I.C et M.I.G. (Messages d’Intérêt Général ou Collectifs) néanmoins Nov FM en tire beaucoup plus des messages publicitaires qu’elle diffuse."},{"label":"Evenements et ateliers","value": 9996, "color":"#3bbd31", "text":"Une seule des quatre radios  que compte le département (Graffiti) propose des ateliers et événements. La part des recettes perçues par ces événements et ateliers est alors légèrement inférieure à la moyenne régionale."},{"label": "Cotisations et dons ","value": 117618,"color": "#00c7e5","text":"Les dons sont une des spécificités des radios confessionnelles néanmoins en Vendée la radio Grafitti en reçoit également mais de manière dérisoire par rapport à RCF. Dans l’ensemble, la part des recettes dues aux dons représente en moyenne légèrement mois que la moyenne régionale."},{"label": "Autre","value": 79819,"color": "#ff8b1d","text":"Comprend les ressources propres des radios et autres financements."}]},				
		{"n":"LA LOIRE ATLANTIQUE","num":"44","id":"#jqvmap2_FR-44","r":11,"s":57,"b":738,"sc":7,"datapie":[{"label":"Subventions","value": 968517,"color":"#ff314f","text":"Les radios de Loire-Atlantique  reçoivent en moyenne autant de subventions que le reste de la région. Dans le détail, Jet FM reçoit beaucoup plus de subventions de la région  et du département que les autres radios et  La Tribu de subventions de sa commune (Saint Nazaire). Prun’ et Sun sont quant à eux très soutenus par le département."},{"label":"Aides à l'emploi","value": 148239,"color":"#954fd1","text":"Les aides à l’emploi sont les dispositifs de financement partiel mis en place par l’État ou les organismes sociaux  dont les radios associatives peuvent bénéficier."},{"label":"Publicité","value":98791,"color":"#004fa9","text":"Les ressources commerciales provenant de la publicité ou du parrainage doivent être inférieures à 20 % du chiffre d’affaires total des radios associative.  Seuls 3 des 11 radios de Loire-Atlantique produisent des messages publicitaires mais toutes diffusent des M.I.C ou M.I.G. (Messages d’Intérêt Général ou Collectifs ). Dans l’ensemble, les radios de Loire-Atlantique sont dans la moyenne régionale en ce qui concerne la publicité."},{"label":"Evenements et ateliers","value": 62257, "color":"#3bbd31", "text":" Les radios associatives interviennent en dehors de leurs antennes pour des événements et des ateliers radios, source de diversification de leurs recettes.  Seuls 4 des 11 radios du département organisent des ateliers et 2 seulement des événements. La part des recettes liées aux ateliers radios et à des événements est alors plus élevée dans les radios mayennaises que dans le reste de la région."},{"label": "Cotisations et dons ","value": 38180,"color": "#00c7e5","text":"Les dons sont une des spécificités des radios confessionnelles néanmoins en Loire-Atlantique la radio SUN en reçoit également mais de manière non significative par rapport à Fidélité. 8 des 11 radios du département bénéficient de cotisations. Dans l’ensemble, les radios de Loire-Atlantique reçoivent moins (4x moins) de dons et cotisations que le reste de la région."},{"label": "Autre","value": 183222,"color": "#ff8b1d","text":"Comprend les ressources propres des radios et autres financements."}]},
		{"n":"LE MAINE ET LOIRE","num":"49","id":"#jqvmap2_FR-49","r":4,"s":16,"b":311,"sc":3,"datapie":[{"label":"Subventions","value": 248217,"color":"#ff314f","text":"Les radios du Maine et Loire reçoivent en moyenne autant de subventions que le reste de la région."},{"label":"Aides à l'emploi","value": 44321,"color":"#954fd1","text":"Les aides à l’emploi sont les dispositifs de financement partiel mis en place par l’État ou les organismes sociaux  dont les radios associatives peuvent bénéficier."},{"label":"Publicité","value":29658,"color":"#004fa9","text":"Les ressources commerciales provenant de la publicité ou du parrainage doivent être inférieures à 20 % du chiffre d’affaires total des radios associative. Seulement deux des quatre radios produisent des messages publicitaires et trois des M.I.C. et M.I.G. (Messages d’Intérêt Général ou Collectifs). La part des recettes lié à la publicité des radios du département est inférieure à la moyenne des autres radios de la région."},{"label":"Evenements et ateliers","value": 18690, "color":"#3bbd31", "text":"Les radios associatives interviennent en dehors de leurs antennes pour des événements et des ateliers radios, source de diversification de leurs recettes.  Seulement une des quatre radios du département fait des événements, de même pour les ateliers radio ce qui place le département largement en dessous de la moyenne régionale."},{"label": "Cotisations et dons ","value": 14345,"color": "#00c7e5","text":"Les dons sont une des spécificités des radios confessionnelles. En Maine et Loire seulement une radio reçoit des dons, les autres radios reçoivent davantage de cotisations. Dans l’ensemble, le Maine et Loire se retrouve avec une moyenne largement inférieure à la moyenne régionale (30% de moins)."},{"label": "Autre","value": 122834,"color": "#ff8b1d","text":"Comprend les ressources propres des radios et autres financements."}]},
		{"n":"LA MAYENNE","num":"53","id":"#jqvmap2_FR-53","r":2,"s":9,"b":117,"sc":2,"datapie":[{"label":"Subventions","value": 108167,"color":"#ff314f","text":"Les radios Mayennaises reçoivent en moyenne moins de subventions que les autres départements, environ 15% de moins par rapport à la région. Il n’y a par exemple pas de subventions du département et des communes pour ces radios."},{"label":"Aides à l'emploi","value": 15665,"color":"#954fd1","text":"Les aides à l’emploi sont les dispositifs de financement partiel mis en place par l’État ou les organismes sociaux dont les radios associatives peuvent bénéficier."},{"label":"Publicité","value":10479,"color":"#004fa9","text":"Les ressources commerciales provenant de la publicité ou du parrainage doivent être inférieures à 20 % du chiffre d’affaires total des radios associatives. Seule une des deux radios mayennaises fait de la publicité sur son antenne sachant que les deux diffusent des M.I.C. et M.I.G (Messages d’Intérêt Général ou Collectifs)."},{"label":"Evenements et ateliers","value": 8738, "color":"#3bbd31", "text":"Les radios associatives interviennent en dehors de leurs antennes pour des événements et des ateliers radios, source de diversification de leurs recettes. La part des recettes liées aux ateliers radios et à des événements est plus faible dans les radios mayennaises que dans le reste de la région."},{"label": "Cotisations et dons ","value": 38546,"color": "#00c7e5","text":"Les dons sont une des spécificités des radios confessionnelles. La part des dons est particulièrement forte en Mayenne, mais pas spécialement plus élevée que dans les autres départements. De même pour les cotisations."},{"label": "Autre","value": 44683,"color": "#ff8b1d","text":"Comprend les ressources propres des radios et autres financements."}]},
		{"n":"LA SARTHE","num":"72","id":"#jqvmap2_FR-72","r":1,"s":7,"b":60,"sc":0,"datapie":[{"label":"Subventions","value": 58893,"color":"#ff314f","text":"La radio sarthoise reçoit autant de subventions que la moyenne régionale bien qu’elle ne reçoive pas de subventions européennes."},{"label":"Publicité","value":2384,"color":"#004fa9","text":" Les ressources commerciales provenant de la publicité ou du parrainage doivent être inférieures à 20 % du chiffre d’affaires total des radios associative. La part des recettes lié à la publicité de RCF Le Mans représente peu  par rapport à la moyenne des autres radios de la région."},{"label": "Cotisations et dons ","value": 44623,"color": "#00c7e5","text":"Les dons sont une des spécificités des radios confessionnelles. RCF étant une radio chrétienne, elle bénéficie de nombreux dons mais beaucoup moins de cotisations."},{"label": "Autre","value": 95,"color": "#ff8b1d","text":"Comprend les ressources propres des radios et autres financements."}]}
	];

	var dpt = d3.select("#carte").selectAll("path")
							  .data(jsonDptInfo);
	var info = d3.select("#infodpt");
	
	dpt.on('click', function (d){
		infofunction(d);
	});

	var dptbig = d3.select("#bigcarte").selectAll("path")
							  .data(jsonDptInfo);
	
	dptbig.on('click', function (d){
		infofunction(d);        
		dpt.attr("fill","#003f4e");
		d3.select(d.id).attr("fill","#179fae");
		self.location.href="index.html#secondPage";
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