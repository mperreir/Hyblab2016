"use strict";

var dataCharts = {
	menage : null,
	parc : null,
	carburant : null
};

var dataDonuts = {
	monomotor: null,
	bimotor : null,
	nomotor : null
};

var dataCars = {
	occasion : null,
	neuf : null
};

function requestGenerateCars(type, year){
	if(!dataCars[type]){
		var requete = $.ajax({
			url : "data/parc/"+type,
			type : "GET",
			dataType : "text",
			success : function(res, statut){
				dataCars[type] = JSON.parse(res).data[type];
				generateCars(dataCars[type][year].pourcentage, type);
				console.log(dataCars[type]);
			},
			error : function(res, statut, error){
				alert(res+" ; "+statut+" ; "+error);
			}
		});
	}else generateCars(dataCars[type][year].pourcentage, type);
}

function requestGenerateChartDonut(type, year){
	if(!dataDonuts[type]){
		var requete = $.ajax({
			url : "data/menage/"+type,
			type : "GET",
			dataType : "text",
			success : function(res, statut){
				dataDonuts[type] = JSON.parse(res).data[type];
				generateMenageDonut(dataDonuts[type][year].pourcentage, type);
			},
			error : function(res, statut, error){
				alert(res+" ; "+statut+" ; "+error);
			}
		});
	}else generateMenageDonut(dataDonuts[type][year].pourcentage, type);
}


function requestGenerateChartDefilement(type){
	if(!dataCharts[type]){
		var requete = $.ajax({
			url : "data/"+type+"/years",
			type : "GET",
			dataType : "text",
			success : generateChart,
			error : function(res, statut, error){
				alert(res+" ; "+statut+" ; "+error);
			}
		});
	}else generateChart(dataCharts[type], "200");
	
};
function generateChart(res, statut){
	var donnees;
	if(typeof res == "string"){
		donnees = JSON.parse(res);
		dataCharts[donnees.categorie] = donnees;
	}else donnees = res;

	var valeurs = [];
	var data = generateChartData(donnees);
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
	var chart = new Chartist.Line(chartId, data, options);

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
	var data = {
			labels : [],
			series : [[]]
		}; 
	for(var i=0; i<donnees.years.length; i++){
		if(i==0){
			if(jQuery.inArray(donnees.years[0], donnees.yearsToScreen) != -1) data.labels.push(donnees.years[0]);
			else(data.labels.push(null));
			data.series[0].push(dataToAdd(donnees, i));
		}
		else{
			for(var j=1; j<donnees.years[i]-donnees.years[i-1]; j++){
				data.labels.push(null);
				data.series[0].push(null);
			}
			if(jQuery.inArray(donnees.years[i], donnees.yearsToScreen) != -1) data.labels.push(donnees.years[i]);
			else(data.labels.push(null));
			data.series[0].push(dataToAdd(donnees, i));
		}
	}
	return data;
};

function dataToAdd(donnees, index){
	
	var retour = null;
	switch(donnees.categorie){
		case "menage":
			retour = donnees.data[donnees.years[index]].mono.pourcentage + 
					donnees.data[donnees.years[index]].biPlus.pourcentage;
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
		x : labelParentOriginPos.x-15+"px",
		y : labelParentOriginPos.y-10+"px"
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
				requestGenerateChartDonut("mono", annee);
				requestGenerateChartDonut("biPlus", annee);
				requestGenerateChartDonut("none", annee);
				console.log(categorie);
				break;
			case "parc":
				console.log(categorie);
				break;
			case "carburant":
				console.log(categorie);
				break;
		}
	});
}

function setPointAnimation(param, categorie, seq, delay, duration){
	var annee = param.axisX.ticks[param.index];

	var chaine = 'line[class="ct-point"]'+
					'[x1="'+param.x+'"]'+
					'[y1="'+param.y+'"]';
	$(chaine).attr("year", annee).attr("categorie", categorie);
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
			requestGenerateChartDonut("mono", "1990");
			requestGenerateChartDonut("biPlus", "1990");
			requestGenerateChartDonut("none", "1990");
			break;
		case 3:
			requestGenerateChartDefilement("parc");
			break;
		case 4:
			requestGenerateChartDefilement("carburant");
			break;
	}
}

function generateMenageDonut(donnee,id){


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
	// Get the total path length in order to use for dash array animation
	var pathLength = data.element._node.getTotalLength();

	// Set a dasharray that matches the path length as prerequisite to animate dashoffset
	data.element.attr({
	  'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
	});

	// Create animation definition while also assigning an ID to the animation for later sync usage
	var animationDefinition = {
		'stroke-dashoffset': {
		id: 'anim' + data.index,
		dur: 3000,
		from: -pathLength + 'px',
		to:  '0px',
		easing: Chartist.Svg.Easing.easeOutQuint,

		// We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
		fill: 'freeze'
		}
	};


	// We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
	data.element.attr({
		'stroke-dashoffset': -pathLength + 'px'
	});

	// We can't use guided mode as the animations need to rely on setting begin manually
	// See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
	data.element.animate(animationDefinition, false);
}

function generateCars(donnee, type){
	var cars = $('.cars[id='+type+'] .car');
	cars.css('background-color', 'black');
	var nbCar = Math.round(donnee/2);
	console.log(type+" : "+donnee+"% -> "+nbCar+" voitures");

	cars
}