"use strict";

var globalpie;

window.addEventListener('load',function () {
	
	globalpie = new d3pie("#pieChartSvg", {
		/*"header": {
			"title": {
				"fontSize": 34,
				"font": "courier"
			},
			"subtitle": {
				"text": "Cliquez pour afficher les valeurs",
				"color": "#999999",
				"fontSize": 12,
				"font": "courier"
			},
			"titleSubtitlePadding": 10
		},
		"footer": {
			"color": "#999999",
			"fontSize": 12,
			"font": "open sans",
			"location": "bottom-center"
		},*/
		"size": {
			"canvasWidth": 250,
			"pieInnerRadius": "73%",
			"pieOuterRadius": "66%"
		},
		"data": {
			"sortOrder": "value-desc",
			"content": [
				{
					"label": "Subventions",
					"value": 968517,
					"color": "#ff314f",
					"text":"Les radios de Loire-Atlantique  reçoivent en moyenne autant de subventions que le reste de la région. Dans le détail, Jet FM reçoit beaucoup plus de subventions de la région  et du département que les autres radios et  La Tribu de subventions de sa commune (Saint Nazaire). Prun’ et Sun sont quant à eux très soutenus par le département."
				},
				{
					"label": "Aides à l'emploi",
					"value": 148239,
					"color": "#954fd1",
					"text":"Les aides à l’emploi sont les dispositifs de financement partiel mis en place par l’État ou les organismes sociaux  dont les radios associatives peuvent bénéficier."
				},
				{
					"label": "Publicité",
					"value": 98791,
					"color": "#004fa9",
					"text":"Les ressources commerciales provenant de la publicité ou du parrainage doivent être inférieures à 20 % du chiffre d’affaires total des radios associative.  Seuls 3 des 11 radios de Loire-Atlantique produisent des messages publicitaires mais toutes diffusent des M.I.C ou M.I.G. (Messages d’Intérêt Général ou Collectifs ). Dans l’ensemble, les radios de Loire-Atlantique sont dans la moyenne régionale en ce qui concerne la publicité."
				},
				{
					"label": "Evenements et ateliers",
					"value": 62257,
					"color": "#3bbd31",
					"text":"Les radios associatives interviennent en dehors de leurs antennes pour des événements et des ateliers radios, source de diversification de leurs recettes.  Seuls 4 des 11 radios du département organisent des ateliers et 2 seulement des événements. La part des recettes liées aux ateliers radios et à des événements est alors plus élevée dans les radios mayennaises que dans le reste de la région."
				},
				{
					"label": "Cotisations et dons ",
					"value": 38180,
					"color": "#00c7e5",
					"text":"Les dons sont une des spécificités des radios confessionnelles néanmoins en Loire-Atlantique la radio SUN en reçoit également mais de manière non significative par rapport à Fidélité. 8 des 11 radios du département bénéficient de cotisations. Dans l’ensemble, les radios de Loire-Atlantique reçoivent moins (4x moins) de dons et cotisations que le reste de la région."
				},
				{
					"label": "Autre",
					"value": 183222,
					"color": "#ff8b1d",
					"text":"Comprend les ressources propres des radios et autres financements."
				}
			]
		},
		"labels": {
			"outer": {
				"format": "none",
				"pieDistance": 15
			},
			"inner": {
				"format": "none"
			},
			"mainLabel": {
				"fontSize": 11
			},
			"percentage": {
				"color": "#999999",
				"fontSize": 11,
				"decimalPlaces": 0
			},
			"value": {
				"color": "#cccc43",
				"fontSize": 11
			},
			"lines": {
				"enabled": true,
				"color": "#777777"
			},
			"truncation": {
				"enabled": true
			}
		},
		"tooltips": {
			"enabled": true,
			"type": "placeholder",
			"string": "{label}: {value}, {percentage}%",
			"styles": {
				"backgroundOpacity": 0.61
			}
		},
		"effects": {
			"pullOutSegmentOnClick": {
				"effect": "linear",
				"speed": 800,
				"size": 20
			}
		},
		"misc": {
			"colors": {
				"segmentStroke": "#000000"
			}
		},
		"callbacks":{
			onClickSegment: function (info){

				console.log(info);
				var is = d3.select("#infoselected");
				pieData = d3.select('#idPieData');
				pieExplains = d3.select('#pieExplains');
				
				if(!info.expanded) {

					pieData.text((100*info.data.value/globalpie.totalSize).toFixed(0) +'%');
					is.text(info.data.value + "€")
						.attr("fill", "white")
						.attr("font-size","16px")
						.attr("font-weight","bold")
						.attr("y","72%");
					pieExplains.html(info.data.text);
					pieExplains.style('visibility', 'visible')
				} else {
					pieData.text("");
					is.text("");
					pieExplains.style('visibility', 'hidden')
				}
			}
		}
	});
	
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
					
	
	var legendCircleSize = 14;
	var legendSpacing = 8;
	var legendsvg = d3.select("#pieInfo").append('svg')
					.attr('id', 'legendSvg')
					.attr('width', 300)
					.attr('height', 300);
	var legend = legendsvg.selectAll('.legend')
					.data(globalpie.options.data.content)
					.enter()
					.append('g')
					.attr('class', 'legend')
					.attr('transform', function(d, i) {
						var height = legendCircleSize + legendSpacing;
						var horiz = -2*legendCircleSize;
						var vert = 	legendCircleSize + i*height;
						return 'translate('+'0'+','+vert+')';
					});
	
	legend.append('circle')
					.attr('cx', legendCircleSize/2)
					.attr('r', legendCircleSize/2)
					.style('fill', function(d) { return d.color; })
					.style('stroke', function(d) { return d.color; });
	legend.append('text')
					.attr('x', legendCircleSize + legendSpacing)
					.attr('y', legendCircleSize - legendSpacing)
					.attr("fill", "#179fae")
					.attr('font-weight', 'bold')
					.attr("font-size", "14px")
					.text(function(d) { return d.label; });
					 
	var pieClick = svg.append("text")
					.attr("id","infoselected")
					.attr("fill", "#179fae")
					.attr("font-size", "12px")
					.attr("text-anchor", "middle")
					.attr("x", "50%")
					.attr("y", "70%")
					.text("Cliquez pour afficher les valeurs");
					
					
	var pieExplains = d3.select("#pieText").append("p")
					.attr("id","pieExplains")
					.style("font-weight", "bold")
					.style("visibility", "hidden");
	

	/*pie = d3.select("#pieChart").select("svg");
	pie.attr("height",300)*/
	//x = document.getElementsByClassName("p0_pieChart");
	//console.log(x);

	//.setAttribute("transform","scale(1), translate(150,150)");

	
	//document.getElementById("pie").setAttribute("transform","scale(1), translate(0,0)");

});
