"use strict";

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
					top : 36.1,
					left : 32
				},
				nbPlace : 11
			},
			{
				origine : {
					top : 34,
					left : 38
				},
				nbPlace : 8
			},
			{
				origine : {
					top : 32.5,
					left : 40
				},
				nbPlace : 8
			},
			{
				origine : {
					top : 29.6,
					left : 43.4
				},
				nbPlace : 9
			}
		]
	},
	occasion : {
		deltaNextPos : {
			top : 0.63,
			left : 1.05
		},
		col : [
			{
				origine : {
					top : 46.1,
					left : 42
				},
				nbPlace : 11
			},
			{
				origine : {
					top : 44,
					left : 48
				},
				nbPlace : 8
			},
			{
				origine : {
					top : 42.5,
					left : 50
				},
				nbPlace : 8
			},
			{
				origine : {
					top : 39.6,
					left : 53.4
				},
				nbPlace : 9
			}
		]
	}
}

function requestData(callback, type){
	var requete = $.ajax({
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

function requestChartCarburant(year){
	if(!data.carburant){
		requestData(function(){
			generateBarChart(data.carburant.data[year]);
		}, "carburant");
	}else{
		generateBarChart(data.carburant.data[year]);
	}
}

function generateBarChart(serie){
	var donnees ={
		labels : ["Diesel", "Essence", "Bicarburant", "Electrique", "Hybride", "Gaz", "Superéthanol"],
		series :[[serie.diesel.pourcentage,serie.essence.pourcentage,serie.bicarburant.pourcentage,serie.electricite.pourcentage, serie.hybride.pourcentage, serie.gaz.pourcentage, serie.superethanol.pourcentage]]
	};
	new Chartist.Bar('#barchart',
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
		
	});
}

function requestGenerateParcDonutCars(type, year){
	if(!data[type]){
		requestData(function(){
			generateParcDonutCars(data.parc.data[year][type].pourcentage, type);	
		}, type);
	}else{
		generateParcDonutCars(data.parc.data[year][type].pourcentage, type);
	}
}

function requestGenerateInfo(type, year, slideId){
	if(!data[type]){
		requestData(function(){
			generateInfo(data[type].yearsComments[year], slideId);

		}, type);
	}else{
		generateInfo(data[type].yearsComments[year], slideId);
	}
}

function generateInfo(text, slideId){
	$('#'+slideId+" .info p").html(text);
}

function requestGenerateMenageDonut(type, year){
	if(!data[type]){
		requestData(function(){
			generateDonut(data.menage.data[year][type].pourcentage, type)
		},type);
	}else generateDonut(data.menage.data[year][type].pourcentage, type);
}


function requestGenerateChartDefilement(type){
	if(!data[type]) requestData(function(){
		generateChart(data[type], "200");
	},type);
	else generateChart(data[type], "200");
	
};
function generateChart(res, statut){
	var donnees = res;

	var valeurs = [];
	var dataChart = generateChartData(donnees);
	var options = fillOptions();
	var chartId;
	switch(donnees.categorie){
		case "menage":
			chartId = '#chartMotorisation';
			break;
		case "carburant":
			chartId = '#chartCarburant';
			break;
		case "parc":
			chartId = '#chartParc';
			break;	
	};
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
			};
		}else if(param.type === 'point'){
			setPointAnimation(param,donnees.categorie,seq,delays,durations);
		}
	});
};


function fillOptions(){
	var retour = {
		axisY : {
			showLabel: false,
			showGrid : false
		},
		axisX : {
			showGrid : false,
			labelOffset : {
				x:-16,
				y:0
			}
		}, 
		lineSmooth: Chartist.Interpolation.cardinal({
			fillHoles: true
		}),
		chartPadding: {
			top: 5,
			right: 30,
			bottom: 5,
			left: 0
		}
	};
	return retour;
};

function generateChartData(donnees){
	var dataChart = {
			labels : [],
			series : [[]]
		}; 
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
			dataChart.series[0].push(dataToAdd(donnees, i));
		}
	}
	return dataChart;
};

function dataToAdd(donnees, index){
	
	var retour = null;
	switch(donnees.categorie){
		case "menage":
			retour = donnees.data[donnees.years[index]].detention.val;
			break;

		case "carburant":
			retour=0;
			var cleanEnergies = ["electricite","hybride","gaz","superethanol","bicarburant"];
			cleanEnergies.forEach(function(carburant){
				retour += donnees.data[donnees.years[index]][carburant].pourcentage;
			});
			break;

		case "parc":
			retour = donnees.data[donnees.years[index]].occasion.pourcentage;
			
			break;
	}
	return retour;
};

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
	var chaine = 'foreignobject[x="'+param.x+'"]'+
				'[y="'+param.y+'"]'+
				'[width="'+param.width+'"]'+
				'[height="'+param.height+'"]';
	var label = $(chaine+" span");
	var labelParent = $(chaine);	

	var labelParentOriginPos = {
		x : parseInt(labelParent.css("x").replace("px","")),
		y : parseInt(labelParent.css("y").replace("px",""))
	};

	//var labelParentOriginPos = labelParent.position();
	label.mouseenter(function(node){
		//Grossissement et changement de couleur du point
		var point = label.parent().parent().parent().find('.ct-point[year="'+param.text+'"][categorie="'+categorie+'"]');
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
		var point = label.parent().parent().parent().find('.ct-point[year="'+param.text+'"]');
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
				break;
			case "parc":
				requestGenerateParcDonutCars("neuf", annee);
				requestGenerateParcDonutCars("occasion", annee);
				requestGenerateInfo(categorie, annee, "s3");
				break;
			case "carburant":
				requestGenerateInfo(categorie, annee, "s4");
				requestChartCarburant(annee);
				break;
		}
	});
}

function setPointAnimation(param, categorie, seq, delay, duration){
	var annee = param.axisX.ticks[param.index];

	var chaine = 'line[class="ct-point"]'+
					'[x1="'+param.x+'"]'+
					'[y1="'+param.y+'"]';

	$(chaine).attr("year", annee).attr("categorie", categorie).attr("yolo", categorie);

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

function relaunchAnimation(index, nextIndex, direction){
	switch(nextIndex){
		case 2:
			requestGenerateChartDefilement("menage");
			requestGenerateMenageDonut("mono", "1990");
			requestGenerateMenageDonut("biPlus", "1990");
			requestGenerateMenageDonut("none", "1990");
			requestGenerateInfo("menage", "1990", "s2");
			break;
		case 3:
			requestGenerateChartDefilement("parc");
			requestGenerateParcDonutCars("neuf", "1990");
			requestGenerateParcDonutCars("occasion", "1990");
			requestGenerateInfo("parc", "1990", "s3");
			break;
		case 4:
			requestGenerateChartDefilement("carburant");
			requestGenerateInfo("carburant", "1990", "s4");
			requestChartCarburant("2009");
			break;
	}
	switch(index){
		case 3:
			removeAllCars();
			break;
	}
}

function generateDonut(donnee,id){


	var label = '<h3>'+donnee+'%</h3>';
	var idStr = '#'+id;
	var options = fillOptionsDonut(label);
	var data
	var chart = new Chartist.Pie(idStr, {
		series: [donnee]
	}, options);

	chart.on('draw', function(data) {
		if(data.type === 'slice') {
			setSliceAnimation(data);
	  	}
	});
};

function fillOptionsDonut(label){
	var retour ={
		donut: true,
		showLabel: true,
		total: 100,
		donutWidth: 8,
		chartPadding: 0,
		showLabel: false,
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

	for(var i=0; i<places.length; i++){
		var place = places[i.toString()];
		$('.cars[id='+type+']').append('<div class="car" id="'+place.colonne+place.place+'"><img src="images/voitures.svg" alt="voiture"/></div>');
		var car = $('#'+place.colonne+place.place);
		var hauteurApparition =((Math.random() * 10)+5);
		car.css('top', (place.top-hauteurApparition).toString()+"vh").css('left',(place.left).toString()+"vw");
		car.css("z-index",30+place.place).css("opacity", 0);
		carSpawnAnimation(car,place);
		car.removeAttr("id");
	};
	generateDonut(donnee, type);
}
function getRandomPlace(type, nb){
	var nbMaxPlaces = 0;
	var nbCol = carPos[type].col.length;
	var retour = [];

	for(var i=0; i<nbCol; i++){
		nbMaxPlaces += carPos[type].col[i].nbPlace;
	};

	var allPlaces = [];
	for(var i=0; i<nbCol; i++){
		for(var j=0; j<carPos[type].col[i].nbPlace; j++){
			allPlaces.push({
				colonne : i,
				place : j
			});
		}
	}

	if(nbMaxPlaces > nb){
		for(var i=0; i<nb; i++){
			var randPlaceIndex = Math.round((Math.random() * (allPlaces.length-1)));
			var place = allPlaces.splice(randPlaceIndex,1)[0];
			place.top = carPos[type].col[place.colonne].origine.top + (carPos[type].deltaNextPos.top * place.place);
			place.left = carPos[type].col[place.colonne].origine.left + (carPos[type].deltaNextPos.left * place.place);
			retour.push(place);
		}
	}
	return retour;
}

function makeCarsDisappear(carNode){
	carNode.animate({
		opacity: 0,
	}, 1000);
}

function removeAllCars(){
	$('.cars .car').remove();
}

function carDestroyAnimation(type){
	var carsToDestroy = $('.cars[id='+type+'] .car').stop().animate({
		opacity : 0
	}, 1000);
}

function carSpawnAnimation(car,place){
	car.stop().animate({
		opacity : 1,
		top : (place.top).toString()+"vh"
	},1500);
}