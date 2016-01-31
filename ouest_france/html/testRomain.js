"use strict";

/*EXEMPLE JQUERY REQUETE HTTP*/
$(document).ready(function(){
	var requete = $.ajax({
		url : "http://127.0.0.1:8080/ouest_france/data/menage/years",
		type : "GET",
		dataType : "text",
		success : generateChart,
		error : function(res, statut, error){
			alert(res+" ; "+statut+" ; "+error);
		}
	});
});

function generateChart(res, statut){
		var donnees = JSON.parse(res);
		var valeurs = [];
		var data = {
			labels : [],
			series : [[]]
		};
		var options = {
			axisY : {
				showLabel: false,
  				showGrid : false,
			},
			axisX : {
  				showGrid : false,
			}, 
			lineSmooth: Chartist.Interpolation.cardinal({
    			fillHoles: true,
  			}),

  			width : '100%',
  			height : '25%',
			
			/*chartPadding: {
    			top: 0,
    			right: 0,
    			bottom: 0,
    			left: 0
  				},*/
		};
		for(var i=0; i<donnees.years.length; i++){
			if(i==0){
				if(jQuery.inArray(donnees.years[0], donnees.yearsToScreen) != -1) data.labels.push(donnees.years[0]);
				else(data.labels.push(null));
				data.series[0].push(donnees.data[donnees.years[0]].mono.pourcentage + 
					donnees.data[donnees.years[0]].biPlus.pourcentage);
			}
			else{
				for(var j=1; j<donnees.years[i]-donnees.years[i-1]; j++){
					data.labels.push(null);
					data.series[0].push(null);
				}
				if(jQuery.inArray(donnees.years[i], donnees.yearsToScreen) != -1) data.labels.push(donnees.years[i]);
				else(data.labels.push(null));
				data.series[0].push(donnees.data[donnees.years[i]].mono.pourcentage + 
					donnees.data[donnees.years[i]].biPlus.pourcentage);
			}
		}

		console.log(data.labels);

		var chart = new Chartist.Line('.ct-chart', data, options);
		var seq = 0;
		var delays = 80;
		var durations = 500;

		chart.on('created', function(){
			seq=0;
		});

		chart.on('draw', function(param){
			seq++;

			if(param.type === 'line'){
				param.element.animate({
					opacity : {
						begin : seq * delays + 100,
						dur : durations,
						from : 0,
						to : 1
					}
				});
			}else if(param.type === 'label'){
				if(jQuery.inArray(param.text, donnees.yearsToScreen == -1)){
					var chaine = 'foreignobject[x="'+param.x+'"]'+
								'[y="'+param.y+'"]'+
								'[width="'+param.width+'"]'+
								'[height="'+param.height+'"]';
					$(chaine+" span").mouseenter(function(node){
						$(this).animate({ 
							fontSize: "2em"
		  				}, 300 );
					});
					$(chaine+" span").mouseleave(function(node){
						$(this).animate({ 
							fontSize: "0.75em"
		  				}, 300 );
					});

				};
			}else if(param.type === 'point'){
				param.element.animate({
				      x1: {
				        begin: seq * delays,
				        dur: durations,
				        from: param.x - 10,
				        to: param.x,
				        easing: 'easeOutQuart'
				      },
				      x2: {
				        begin: seq * delays,
				        dur: durations,
				        from: param.x - 10,
				        to: param.x,
				        easing: 'easeOutQuart'
				      },
				      opacity: {
				        begin: seq * delays,
				        dur: durations,
				        from: 0,
				        to: 1,
				        easing: 'easeOutQuart'
				      }
    			});
			}
		});
};
/*
var data = undefined;
var apiAddr = "http://127.0.0.1:8080/ouest_france/data";
fetch('http://127.0.0.1:8080/ouest_france/data/parc/years/2009').then(function(response) {
    return response.json()
  }).then(function(json) {
  	data = {};
    data.json = json;
    return json;
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  });

$(document).click(function(){
	if(data) console.log(JSON.stringify(data));
});*/
