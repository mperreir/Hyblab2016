"use strict";

$(document).ready(function(){
	var requete = $.ajax({
		url : "http://127.0.0.1:8080/ouest_france/data/parc/years",
		type : "GET",
		dataType : "text",
		success : generateMenageChart,
		error : function(res, statut, error){
			alert(res+" ; "+statut+" ; "+error);
		}
	});
});

function generateMenageChart(res, statut){
		var donnees = JSON.parse(res);
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
				//Animation d'apparition de la courbe
				setLineAnimation(param, seq, delays, durations);
			}else if(param.type === 'label'){

				if(jQuery.inArray(param.text, donnees.yearsToScreen == -1)){
					setLabelAnimation(param);
				};
			}else if(param.type === 'point'){
				
				setPointAnimation(param,seq,delays,durations);
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
				x:-13,
				y:0
			}
		}, 
		showArea : true,
		lineSmooth: Chartist.Interpolation.cardinal({
			fillHoles: true
		}),
		width : '75%',
		height : '12.5%',
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
	console.log(data);
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
			retour = 0;
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

function setLabelAnimation(param){
	var chaine = 'foreignobject[x="'+param.x+'"]'+
				'[y="'+param.y+'"]'+
				'[width="'+param.width+'"]'+
				'[height="'+param.height+'"]';
	var label = $(chaine+" span");
	var labelParent = $(chaine);			
	var labelParentOriginPos = labelParent.position();
	
	//var pointOriginWidth = 
	label.mouseenter(function(node){
		//Grossissement et changement de couleur du point
		var point = label.parent().parent().parent().find('.ct-point[year="'+param.text+'"]');
		point.stop().animate({
			"stroke-width" : 50,
			opacity : 0.5
		}, 300);
		//Grossissement du label
		$(this).stop().animate({ 
			fontSize: "2em",
			}, 300 );

			//Décalage à gauche au fur et à mesure du grossissement du label
			$(this).parent().stop().animate({ 
			x : labelParentOriginPos.left-18,
			y : labelParentOriginPos.top-10
			}, 300 );
	});
	label.mouseleave(function(node){
		//Retrecissement du point et retour à la vouleur d'origine
		var point = label.parent().parent().parent().find('.ct-point[year="'+param.text+'"]');
		point.stop().animate({
			stroke : "rgb(255,0,0)",
			"stroke-width" : 10,
			opacity : 1
		}, 300);

		//Retrecissement du label
		$(this).stop().animate({ 
			fontSize: "0.75em"
			}, 300 );

			//Retrecissement du label et retour à la position d'origine
			$(this).parent().stop().animate({ 
			x : labelParentOriginPos.left,
			y : labelParentOriginPos.top
			}, 300 );
	});
}

function setPointAnimation(param, seq, delay, duration){
	var annee = param.axisX.ticks[param.index];

	var chaine = 'line[class="ct-point"]'+
					'[x1="'+param.x+'"]'+
					'[y1="'+param.y+'"]';
	$(chaine).attr("year", annee);
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
