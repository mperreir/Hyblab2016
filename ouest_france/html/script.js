"use strict";
/*global Chartist*/
var data = {
	menage : null,
	parc : null,
	carburant : null
};

var carPos = {
	neuf : {
		deltaNextPos : {
			top : 0.63,
			left : 1.05
		},
		col : [
			{
				origine : {
					top : 40.7,
					left : 32
				},
				nbPlace : 11
			},
			{
				origine : {
					top : 38.7,
					left : 38
				},
				nbPlace : 8
			},
			{
				origine : {
					top : 37.2,
					left : 40
				},
				nbPlace : 8
			},
			{
				origine : {
					top : 34.3,
					left : 43.2
				},
				nbPlace : 9
			}
		]
	},
	occasion : {
		deltaNextPos : {
			top : 0.64,
			left : 1.06
		},
		col : [
			{
				origine : {
					top : 49.7,
					left : 51.2
				},
				nbPlace : 1
			},
			{
				origine : {
					top : 52.2,
					left : 55.3
				},
				nbPlace : 6
			},
			{
				origine : {
					top : 47.5,
					left : 55.8
				},
				nbPlace : 7
			},
			{
				origine : {
					top : 46.2,
					left : 57.9
				},
				nbPlace : 7
			},
			{
				origine : {
					top : 43.5,
					left : 60.4
				},
				nbPlace : 10
			}
		]
	}
};

var allPlaces = {};
var nbMaxPlaces = null;

function requestData(type, callback){
	$.ajax({
		url : "data/"+type+"/years",
		type : "GET",
		dataType : "text",
		success : function(res, status){
			data[type] = JSON.parse(res);
			callback();
		},
		error : function(res, statut, error){
			alert(res+" ; "+statut+" ; "+error);
		}
	});
}

function testRequestedData(type, callback){
	if(!data[type]) requestData(type, callback);
	else callback();
}

function requestGeneratePhrase(categorie, annee){ 
	if(!data[categorie]) requestData(categorie, function(){ generatePhrase(categorie, annee); });
	else generatePhrase(categorie, annee);
}
function requestChartCarburant(year){ 
	if(!data["carburant"]) requestData("carburant", function(){ generateBarChart(data.carburant.data[year]); });
	else generateBarChart(data.carburant.data[year]);
}
function requestGenerateParcDonutCars(type, year){ 
	if(!data["parc"]) requestData("parc", function(){ generateParcDonutCars(data.parc.data[year][type].pourcentage, type); });
	else generateParcDonutCars(data.parc.data[year][type].pourcentage, type);
}
function requestGenerateInfo(categorie, year, slideId){
	if(!data[categorie]) requestData(categorie, function(){ generateInfo(data[categorie].yearsComments[year], slideId); });
	else generateInfo(data[categorie].yearsComments[year], slideId);
}
function requestGenerateMenageDonut(type, year){ 
	if(!data["menage"]) requestData("menage", function(){ generateDonut(data.menage.data[year][type].pourcentage, type); });
	else generateDonut(data.menage.data[year][type].pourcentage, type);
}
function requestGenerateChartDefilement(categorie){ 
	if(!data[categorie]) requestData(categorie, function(){ generateChart(data[categorie]); });
	else generateChart(data[categorie]);
}

function generatePhrase(type, annee){
	switch(type){
		case "menage":
			var pourcentage = Math.round(data.menage.data[annee].biPlus.pourcentage + data.menage.data[annee].mono.pourcentage);
				$("#phraseMenage p").html("En "+annee+", il y avait "+pourcentage+"% de ménages motorisés.");	
			break;
		case "parc":
			$("#phraseDetention p").html("En "+annee+",les français gardaient leur voiture "+data.menage.data[annee].detention.val+" ans en moyenne.");			
			break;

		case "carburant":
			var cleanEnergies = ["electricite","hybride","gaz","superethanol","bicarburant"];
			var value = 0;
			cleanEnergies.forEach(function(carburant){
				value += data.carburant.data[annee][carburant].pourcentage;
			});
			$("#phraseCarburant p").html("En "+annee+", "+Math.round(value*10)/10+" % des voitures vendues utilisaient des énergies propres.");		
			break;
	}
}

function generateInfo(text, slideId){
	$('#'+slideId+" .info p").html(text);
}

function generateChart(donnees){
	var dataChart = generateChartData(donnees);
	var chartId = "#chart"+donnees.categorie;
	var chartLabel;
	var options = fillOptions(chartLabel);
	var chart = new Chartist.Line(chartId, dataChart, options);
	
	var seq = 0;
	var delays = 80;
	var durations = 500;

	chart.on('created', function(){
		seq=0;
	});

	chart.on('draw', function(param){
		seq++;

		if(param.type === 'line'){
			setLineAnimation(param, seq, delays, durations);
		}else if(param.type === 'label'){
			if(jQuery.inArray(param.text, donnees.yearsToScreen == -1)){
				setLabelAnimation(param, donnees.categorie);
			}
		}else if(param.type === 'point'){
			setPointAnimation(param,donnees.categorie,seq,delays,durations);
		}
	});
}


function fillOptions(){
	var retour = {
		axisY : { showLabel:false , showGrid:false },
		axisX : { showGrid:false , labelOffset:{ x:-16, y:0 } }, 
		lineSmooth: Chartist.Interpolation.cardinal({ fillHoles:true }),
		chartPadding: { top:5, right:30 , bottom:5 , left:0 } };
	return retour;
}

function generateChartData(donnees){
	
	var dataChart = { labels:[], series:[[]] }; 
	
	for(var i=0; i<donnees.years.length; i++){
		if(i==0){
			if(jQuery.inArray(donnees.years[0], donnees.yearsToScreen) != -1) dataChart.labels.push(donnees.years[0]);
			else(dataChart.labels.push(null));
			dataChart.series[0].push(dataToAdd(donnees, i));
		}
		else{
			for(var j=1; j<donnees.years[i]-donnees.years[i-1]; j++){
				dataChart.labels.push(null);
				dataChart.series[0].push(null);
			}
			if(jQuery.inArray(donnees.years[i], donnees.yearsToScreen) != -1) dataChart.labels.push(donnees.years[i]);
			else(dataChart.labels.push(null));
			dataChart.series[0].push({value : dataToAdd(donnees, i), meta : dataToAdd(donnees, i)});
		}
	}
	return dataChart;
}

function dataToAdd(donnees, index){
	
	var retour = null;
	switch(donnees.categorie){
		case "menage":
			retour = donnees.data[donnees.years[index]].biPlus.pourcentage + donnees.data[donnees.years[index]].mono.pourcentage;
			break;

		case "carburant":
			retour=0;
			var cleanEnergies = ["electricite","hybride","gaz","superethanol","bicarburant"];
			cleanEnergies.forEach(function(carburant){
				retour += donnees.data[donnees.years[index]][carburant].pourcentage;
			});
			break;

		case "parc":
			retour = data.menage.data[donnees.years[index]].detention.val;
			
			break;
	}
	return retour;
}

function setLineAnimation(param, seq, delay, duration){
	param.element.animate({
		opacity : {
			begin : seq * delay + 100,
			dur : duration,
			from : 0,
			to : 1
		}
	});
}

function setLabelAnimation(param, categorie){
	var id = "label"+categorie+param.text;
	
	param.element.attr({id : id});
	
	var labelParent = $("#"+id);
	var label = labelParent.children();

	var labelParentOriginPos = {
		x : parseInt(labelParent.attr("x").replace("px",""), 10),
		y : parseInt(labelParent.attr("y").replace("px",""), 10)
	};
	
	//var labelParentOriginPos = labelParent.position();
	label.mouseenter(function(node){
		//Grossissement et changement de couleur du point
		//var point = label.parent().parent().parent().find('.ct-point[year="'+param.text+'"][categorie="'+categorie+'"]');
		
		var point = $("#"+"point"+categorie+param.text);
		point.stop().animate({
			"stroke-width" : 20,
			opacity : 0
		}, 300);
		//Grossissement du label
		$(this).stop().animate({ 
			fontSize: "3vmin",
			}, 300 );

		//Décalage à gauche au fur et à mesure du grossissement du label
		$(this).parent().stop().animate({ 
		x : labelParentOriginPos.x-10+"px",
		y : labelParentOriginPos.y-5+"px"
		}, 300 );
	});
	
	label.mouseleave(function(node){
		//Retrecissement du point et retour à la vouleur d'origine
		//var point = label.parent().parent().parent().find('.ct-point[year="'+param.text+'"]');
		var point = $("#"+"point"+categorie+param.text);
		point.stop().animate({
			"stroke-width" : 10,
			opacity : 1
		}, 300);

		//Retrecissement du label
		$(this).stop().animate({ 
			fontSize: "2vmin"
			}, 300 );

		//Retrecissement du label et retour à la position d'origine
		$(this).parent().stop().animate({ 
		x : labelParentOriginPos.x+"px",
		y : labelParentOriginPos.y+"px"
		}, 300 );
	});

	label.click(function(){
		var annee = $(this).html();
		switch(categorie){
			case "menage":
				requestGenerateMenageDonut("mono", annee);
				requestGenerateMenageDonut("biPlus", annee);
				requestGenerateMenageDonut("none", annee);
				requestGenerateInfo(categorie, annee, "s2");
				requestGeneratePhrase("menage", annee);			
				break;
			case "parc":
				requestGenerateParcDonutCars("neuf", annee);
				requestGenerateParcDonutCars("occasion", annee);
				requestGenerateInfo(categorie, annee, "s3");
				requestGeneratePhrase("parc", annee);				
				break;
			case "carburant":
				requestGenerateInfo(categorie, annee, "s4");
				requestChartCarburant(annee);
				requestGeneratePhrase("carburant", annee);					
				break;
		}
	});
}

function setPointAnimation(param, categorie, seq, delay, duration){
	
	var annee = param.axisX.ticks[param.index];
	var id = "point"+categorie+annee;
	
	
	if(!annee) param.element.attr({ opacity : "0"});
	else{
		param.element.attr({ id : id });
	
		param.element.animate({
		      x1: {
		        begin: seq * delay,
		        dur: duration,
		        from: param.x - 10,
		        to: param.x,
		        easing: 'easeOutQuart'
		      },
		      x2: {
		        begin: seq * delay,
		        dur: duration,
		        from: param.x - 10,
		        to: param.x,
		        easing: 'easeOutQuart'
		      },
		      opacity: {
		        begin: seq * delay,
		        dur: duration,
		        from: 0,
		        to: 1,
		        easing: 'easeOutQuart'
		      }
		});
	}
	
}

function relaunchAnimation(index, nextIndex, direction){
	switch(nextIndex){
		case 1:
			animateCloud(".nuage");
			animateImage(".acceuil");
			break;
		case 2:
			requestGenerateChartDefilement("menage");
			requestGenerateMenageDonut("mono", "1990");
			requestGenerateMenageDonut("biPlus", "1990");
			requestGenerateMenageDonut("none", "1990");
			requestGenerateInfo("menage", "1990", "s2");
			animateCloud(".nuage2");
			requestGeneratePhrase("menage", "1990");
			break;
		case 3:
			requestGenerateChartDefilement("parc");
			requestGenerateParcDonutCars("neuf", "1990");
			requestGenerateParcDonutCars("occasion", "1990");
			requestGenerateInfo("parc", "1990", "s3");
			requestGeneratePhrase("parc", "1990");
			break;
		case 4:
			requestGenerateChartDefilement("carburant");
			requestGenerateInfo("carburant", "2009", "s4");
			requestChartCarburant("2009");
			requestGeneratePhrase("carburant", "2009");
			break;
	}
	switch(index){
		case 1:
			animateStop('.nuage');
			animateStop('.acceuil');
			break;
		case 2:
			animateStop('.nuage2');
			break;
		case 3:
			removeAllCars();
			break;
	}
}



function generateDonut(donnee,id){

	var label = '<h3>'+donnee+'%</h3>';
	var idStr = '#'+id;
	var options = fillOptionsDonut(label);

	var chart = new Chartist.Pie(idStr, { series:[donnee] }, options);

	chart.on('draw', function(data) {
		if(data.type === 'slice') {
			setSliceAnimation(data);
	  	}
	});
}

function fillOptionsDonut(label){
	var retour ={
		donut: true,
		showLabel: false,
		total: 100,
		donutWidth: "20%",
		chartPadding: 0,
		startAngle: 190,
		plugins: [
            Chartist.plugins.fillDonut({
                items: [{
					content: label,
					position: 'center'
				}]
            })
        ],
	};
	return retour;
}
function setSliceAnimation(data){
	var pathLength = data.element._node.getTotalLength();

	data.element.attr({
	  'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
	});

	var animationDefinition = {
		'stroke-dashoffset': {
		id: 'anim' + data.index,
		begin : 500,
		dur: 3000,
		from: -pathLength + 'px',
		to:  '0px',
		easing: Chartist.Svg.Easing.easeOutQuint,
		fill: 'freeze'
		}
	};

	data.element.attr({
		'stroke-dashoffset': -pathLength + 'px'
	});

	data.element.animate(animationDefinition, false);
}

function generateParcDonutCars(donnee, type){

	carDestroyAnimation(type);
	var newNbCar = Math.round(donnee/2);

	var places = getRandomPlace(type, newNbCar);

	var parkzone = $("#cars"+type);
	
	for(var i=0; i<places.length; i++){
		var place = places[i.toString()];
		parkzone.append('<div class="car" id="car'+place.colonne+place.place+'"><img src="images/voitures.svg" alt="voiture"/></div>');
		var car = $('#car'+place.colonne+place.place);
		var hauteurApparition =((Math.random() * 10)+5);
		car.css('top', (place.top-hauteurApparition).toString()+"vh").css('left',(place.left).toString()+"vw");
		car.css("z-index",30+place.place).css("opacity", 0);
		carSpawnAnimation(car,place);
		car.removeAttr("id");
	}
	generateDonut(donnee, type);
}

function getRandomPlace(type, nb){
	console.log(carPos);
	var nbCol = carPos[type].col.length;
	var retour = [];

	if(!nbMaxPlaces){
		nbMaxPlaces = 0;
		for(var i=0; i<nbCol; i++){
			nbMaxPlaces += carPos[type].col[i].nbPlace;
		}
	}
	
		console.log("########"+type);
		console.log("Nb col : "+carPos[type].col.length);
		for(var z=0; z<carPos[type].col.length; z++){
			
			console.log("Col "+z+" "+carPos[type].col[z].nbPlace+" places");
		}
		
	if(!allPlaces[type]){
		allPlaces[type] = [];
		for(i=0; i<nbCol; i++){
			for(var j=0; j<carPos[type].col[i].nbPlace; j++){
				allPlaces[type].push({
					colonne : i,
					place : j
				});
			}
		}
	}
	
	var copieAllPlaces = allPlaces[type].slice();
	if(nbMaxPlaces > nb){
		for(i=0; i<nb; i++){
			var randPlaceIndex = Math.round((Math.random() * (copieAllPlaces.length-1)));
			var place = copieAllPlaces.splice(randPlaceIndex,1)[0];
			place.top = carPos[type].col[place.colonne].origine.top + (carPos[type].deltaNextPos.top * place.place);
			place.left = carPos[type].col[place.colonne].origine.left + (carPos[type].deltaNextPos.left * place.place);
			retour.push(place);
		}
	}
	return retour;
}

function removeAllCars(){
	$("#carsoccasion, #carsneuf").children().remove();
}

function carDestroyAnimation(type){
	var car = $("#cars"+type).children();
	car.stop().animate({
		opacity : 0
	}, 800, car.remove);
}

function carSpawnAnimation(car,place){
	var duration = Math.random()*500+1250;
	
	car.stop().animate({
		top : (place.top).toString()+"vh"
	},{
		duration : duration,
		easing : "easeOutBounce",
		queue : false
	}).animate({
		opacity : 1
	}, duration);
}


function generateBarChart(serie){
	var donnees ={
		labels : ["Diesel", "Essence", "Bicarburant", "Electrique", "Hybride", "Gaz", "Superéthanol"],
		series :[[serie.diesel.pourcentage,serie.essence.pourcentage,serie.bicarburant.pourcentage,serie.electricite.pourcentage, serie.hybride.pourcentage, serie.gaz.pourcentage, serie.superethanol.pourcentage]]
	
	};
	var chart = new Chartist.Bar('#barchart',
	donnees,
	{
		axisX:{
			showGrid: false,
			showLabel: false
		},
		axisY:{
			showLabel: true,
			showGrid: false,
			offset:100
		},
		horizontalBars: true,
			chartPadding: {
		    top: 15,
		    right: 35,
		    bottom: 5,
		    left: 10
  		}
	});
	
	chart.on('draw', function(param){
		if(param.type === 'bar'){
						
			var valeur = $("#barchart svg");

			valeur.appendSvg('text', {
				id : param.axisY.ticks[param.index],
				x : param.x2 + 1,
				y : param.y2 + 5,
				class : "ct-label",
				opacity : 0,
			}, Math.round(param.value.x * 10)/10+'%');

			var label = $('#'+param.axisY.ticks[param.index]);
			
			label.delay(1000).animate({
				opacity : 1,
			},500);
			
			param.element.animate({
				x2: {
					begin: 0,
					dur: 1000,
					from: param.x1,
					to: param.x2,
					easing: 'easeOutQuart'
				}
			});
		}
	});
}

function animateStop(className){
	$(className).stop();
}
function animateImage(className){
	var obj = $(className);
	animateTop(obj, 4000, 1);
	obj.dequeue("top");
	animateSize(obj, 2000, 1);
	obj.dequeue("size");
	animateLeft(obj, 4500, 2);
	obj.dequeue("left");
}

function animateCloud(className){
	var obj = $(className);
	animateTop(obj, 2000, 1);
	obj.dequeue("top");
	animateSize(obj, 3000, 2.5);
	obj.dequeue("size");
	animateLeft(obj, 2500, 2);
	obj.dequeue("left");
}
function animateSize(obj, duration_factor, random_factor){
	
	obj.each(function(){

		var seed = getPartiallyRandomSeed(random_factor);
		var duration = getPartiallyRandomDuration(duration_factor);

		$(this).animate({
			width : seed[0]+"vw"
		},{
			queue : "size",
			duration : duration,
			easing : "easeInOutSine"
		}).animate({
			width : seed[1]+"vw"
		},{
			queue : "size",
			duration : duration,
			easing : "easeInOutSine",
			done: animateSize.bind(undefined, obj, duration_factor, random_factor)
		});
	});
}

function animateTop(obj, duration_factor, random_factor){

	obj.each(function(){

		var seed = getPartiallyRandomSeed(random_factor);
		var duration = getPartiallyRandomDuration(duration_factor);

		$(this).animate({
			top : seed[0]+"vh"
		},{
			queue : "top",
			duration : duration,
			easing : "easeInOutSine"
		}).animate({
			top : seed[1]+"vh"
		},{
			queue : "top",
			duration : duration,
			easing : "easeInOutSine",
			done: animateTop.bind(undefined, obj, duration_factor, random_factor)
		});
	});
}

function animateLeft(obj, duration_factor, random_factor){

	obj.each(function(){

		var seed = getPartiallyRandomSeed(random_factor);
		var duration = getPartiallyRandomDuration(duration_factor);

		$(this).animate({
			left : seed[0]+"vw"
		},{
			queue : "left",
			duration : duration,
			easing : "easeInOutSine"
		}).animate({
			left : seed[1]+"vw"
		},{
			queue : "left",
			duration : duration,
			easing : "easeInOutSine",
			done: animateLeft.bind(undefined, obj, duration_factor, random_factor)
		});
	});
}

function getPartiallyRandomDuration(duration){
	return Math.round((Math.random()-0.5)*duration/2+duration);
}

function getPartiallyRandomSeed(random){
	var retour = [];

	var seed = Math.abs((Math.random()-0.5)*random*2);

	if(seed > 0){
		retour[0] = "+="+seed;
		retour[1] = "-="+seed;
	}else{
		retour[0] = "-="+seed;
		retour[1] = "+="+seed;
	}
	return retour;
}
jQuery.fn.extend({
    appendSvg:function (nom,attributs,text)
              {
                  var newSvgNode = document.createElementNS("http://www.w3.org/2000/svg",nom);
                  for (var attr in attributs)
                  {
                          var valeur = attributs[attr];
                          newSvgNode.setAttribute(attr,valeur);
                  }
                  var size = this.length;
                  for (var i = 0; i < size; i++)
                  {
                          this[i].appendChild(newSvgNode);
                  }
                  newSvgNode.appendChild(document.createTextNode(text));
                  return newSvgNode;
              }
});

function counterSoldCars(){
	var counter = 0;
	$("#carCounter").html("Depuis votre arrivée sur cette page, aucune voiture n'a été vendue.");
	setInterval(function(){
		if(counter < 0) counter = 0;
		counter++;
		if(counter > 1) $("#carCounter").html("Depuis votre arrivée sur cette page, "+counter+" voitures ont été vendues.");
		else if(counter == 1) $("#carCounter").html("Depuis votre arrivée sur cette page, une voiture a été vendue.");
		
	},4200);
}

function animateMethodo(){
	$("#methodo").click(function(){
		if($(this).attr("statut") == "small"){

			$(this).attr("statut", "big");
			$(this).animate({
				height : "80vh",
				width : "60vw",
				left : "20vw"
			},1000).animate({
				opacity : 1
			}, 500, function(){
				$("#textMethodo").css("display", "block");
			});

			$("#textMethodo").delay(1500).animate({
				opacity : 1
			},1000);
		}
		else{
			$(this).attr("statut", "small");

			$("#textMethodo").animate({
				opacity : 0
			},1000, function(){
				$(this).css("display", "none");
			});

			$(this).delay(1000).animate({
				opacity : 0.6
			},500).animate({
				height : "5ch",
				width : "10vw",
				left: "75vw"
			},1000);

			
		}
	});
}