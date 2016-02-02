"use strict";

var dataCharts = {
		menage : null,
		parc : null,
		carburant : null,
}

function requestGenerateChart(type){
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
			//offset : 100,
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
			fontSize: "2em",
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
			fontSize: "1em"
			}, 300 );

		//Retrecissement du label et retour à la position d'origine
		$(this).parent().stop().animate({ 
		x : labelParentOriginPos.x+"px",
		y : labelParentOriginPos.y+"px"
		}, 300 );
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

function relaunchChartAnimation(index, nextIndex, direction){
	console.log(index+"->"+nextIndex);
	switch(nextIndex){
		case 2:
			requestGenerateChart("menage");
			break;
		case 3:
			requestGenerateChart("parc");
			break;
		case 4:
			requestGenerateChart("carburant");
			break;
	}
}