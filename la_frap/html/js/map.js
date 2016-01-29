"use strict";

window.addEventListener('load', function () {

	var map1 = $(document).ready(function () {
		$('#bigmap').vectorMap({
			map:'pays_de_la_loire',
			backgroundColor: 'none',
			color:'#003f4e',
			selectedColor:'#003f4e',
			hoverColor:'#006f7e',
			series:{
				regions:[{
					attribute:'fill', 
				}]
			}, 
		});

		$('#bigmap').css("background-color","rgba(0,0,0,0)");

		
	});
	
	var map2 = $(document).ready(function () {
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
		});

		//map.series.regions[0].setValues("#179fae");

		$('#map').css("background-color","rgba(0,0,0,0)");
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

	var jsonDptInfo = [
		{"n":"Vendee","r":5,"a":6,"s":4,"b":62,"sc":9},				
		{"n":"Loire Atlantique","r":3,"a":4,"s":3,"b":58,"sc":5},
		{"n":"Maine et Loire","r":4,"a":2,"s":6,"b":53,"sc":2},
		{"n":"Sarthe","r":2,"a":4,"s":2,"b":65,"sc":0},
		{"n":"Mayenne","r":8,"a":3,"s":5,"b":50,"sc":7},

	]

	var dpt = d3.select("#carte").selectAll("path")
							  .data(jsonDptInfo);
	var info = d3.select("#infodpt");
	
	dpt.on('click', function (d){
		info.style("visibility" ,"visible");
		info.html("<p class='titre'>" + d.n + "</p><p>Radios : " + d.r + "</p><p>Antennes : " + d.a + "</p><p>Salaries : " + d.s + "</p><p>Benevoles : " + d.b + "</p><p>Service Civique : " + d.sc + "</p>");
	});


	var jsonMarker = [
		{"x":134.716,"y":330.95,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":142.93,"y":322.737,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":26.323,"y":330.95,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":67.387,"y":297.277,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":41.635,"y":222.281,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":58.95,"y":248.742,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":150.455,"y":151.125,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":58.95,"y":260.654,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":101.524,"y":223.309,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":109.123,"y":229.881,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":86.481,"y":255.727,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":120.008,"y":230.087,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":115.487,"y":219.817,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":99.538,"y":237.479,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":110.766,"y":240.15,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":238.695,"y":197.208,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":248.007,"y":200.7,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":240.615,"y":208.913,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":327.673,"y":199.878,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":232.514,"y":138.131,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":248.007,"y":47.732,"r":3.492,"c":"white","texte":"Radio 1"},
		{"x":337.444,"y":103.58,"r":3.492,"c":"white","texte":"Radio 1"}

	]

	var markers = markersContainer.selectAll("circle")
										.data(jsonMarker)
										.enter()
										.append("circle");

	var div = d3.select("body")
				.append("div")
				.attr("class", "tooltip");

	var markerAttributes = markers
           .attr("cx", function (d) {return d.x;})
           .attr("cy", function (d) {return d.y;})
           .attr("r", function (d) {return d.r;})
           .on("mouseover", function (d) {
           		d.c = "red";
           		d.r = 4.3;
           		markers.attr("r", function (d) {return d.r;})
					   .style("fill", function (d) {return d.c;});
           })
           .on("click", function (d) {
           		div.html(d.texte)
           		   .style("left",(d3.event.pageX) + "px")
           		   .style("top",(d3.event.pageY+10) + "px")
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