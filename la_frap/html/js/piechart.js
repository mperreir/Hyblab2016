"use strict";

window.addEventListener('load',function () {
	
	var pie = new d3pie("pieChart", {
		/*"header": {
			"title": {
				"fontSize": 34,
				"font": "courier"
			},
			"subtitle": {
				"color": "#999999",
				"fontSize": 10,
				"font": "courier"
			},
			"titleSubtitlePadding": 10
		},
		"footer": {
			"color": "#999999",
			"fontSize": 10,
			"font": "open sans",
			"location": "bottom-left"
		},*/
		"size": {
			"canvasWidth": 300,
			"pieInnerRadius": "64%",
			"pieOuterRadius": "66%"
		},
		"data": {
			"sortOrder": "label-desc",
			"content": [
				{
					"label": "Subventions",
					"value": 68,
					"color": "#ea0000"
				},
				{
					"label": "Aides à l'emploi",
					"value": 10,
					"color": "#ff00f8"
				},
				{
					"label": "Publicité",
					"value": 7,
					"color": "#1000ff"
				},
				{
					"label": "Evenements",
					"value": 2,
					"color": "#00ff23"
				},
				{
					"label": "Cotisations et dons ",
					"value": 2,
					"color": "#00f8ff"
				},
				{
					"label": "Autre",
					"value": 20,
					"color": "#ff5f00"
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
					pieData.text(info.data.value);
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

	/*pie = d3.select("#pieChart").select("svg");
	pie.attr("height",300)*/
	//x = document.getElementsByClassName("p0_pieChart");
	//console.log(x);

	//.setAttribute("transform","scale(1), translate(150,150)");

	
	//document.getElementById("pie").setAttribute("transform","scale(1), translate(0,0)");

});
