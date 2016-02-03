"use strict";

window.addEventListener('load',function () {
	
	var pie = new d3pie("pieChart", {
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
			"sortOrder": "label-desc",
			"content": [
				{
					"label": "Subventions",
					"value": 68,
					"color": "#ff314f"
				},
				{
					"label": "Aides à l'emploi",
					"value": 10,
					"color": "#954fd1"
				},
				{
					"label": "Publicité",
					"value": 7,
					"color": "#004fa9"
				},
				{
					"label": "Evenements",
					"value": 2,
					"color": "#3bbd31"
				},
				{
					"label": "Cotisations et dons ",
					"value": 2,
					"color": "#00c7e5"
				},
				{
					"label": "Autre",
					"value": 20,
					"color": "#ff8b1d"
				}
			]
		},
		"labels": {
			"outer": {
				"format": "none",
				"pieDistance": 20
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
				console.log(info.data.value);
				console.log(pie.total);
				
				if(!info.expanded) {
					pieData.text((100*info.data.value/pie.totalSize).toFixed(0) +'%');
				} else {
					pieData.text("");
				}
				/*if (!info.expanded) {
					$("#pieSection").css("visibility", "visible")
					$("#pieSection").html(info.data.value);
				} else {
					$("#pieSection").css("visibility", "hidden");
				}*/
			}
		}
	});
	
	var svg = d3.select("#pieChart").select("svg");
	var pieData = svg.append("text")
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
					.attr('height', 300)
	var legend = legendsvg.selectAll('.legend')
					.data(pie.options.data.content)
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
					.style('stroke', function(d) { return d.color; })	
	
	legend.append('text')
					.attr('x', legendCircleSize + legendSpacing)
					.attr('y', legendCircleSize - legendSpacing)
					.attr("fill", "white")
					.attr("font-size", "14px")
					.text(function(d) { return d.label; });
					 
	var pieClick = svg.append("text")
					.attr("fill", "#179fae")
					.attr("font-size", "14px")
					.attr("text-anchor", "middle")
					.attr("x", "50%")
					.attr("y", "75%")
					.text("Cliquez pour afficher les valeurs");

	svg.select('.p0_pieChart').attr("transform","scale(0.8)");

	/*pie = d3.select("#pieChart").select("svg");
	pie.attr("height",300)*/
	//x = document.getElementsByClassName("p0_pieChart");
	//console.log(x);

	//.setAttribute("transform","scale(1), translate(150,150)");

	
	//document.getElementById("pie").setAttribute("transform","scale(1), translate(0,0)");

});
