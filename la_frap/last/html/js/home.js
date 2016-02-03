"use strict";

window.addEventListener('load', function (){

	var home = d3.selectAll("svg.homesvg");
	var homerect = home.select("g.fondmaison");

	home.on("mouseover", function (){
		home.select("g.maison").selectAll("polyline")
							   .attr("stroke","#031d2a");
		home.select("g.maison").selectAll("rect")
							   .attr("stroke","#031d2a");
		home.select("g.maison").selectAll("line")
							   .attr("stroke","#031d2a");		
		homerect.selectAll("rect")
				.attr("stroke","#031d2a")
				.attr("fill", "#179FAE");
	});

	home.on("mouseout", function (){
		home.select("g.maison").selectAll("polyline")
							   .attr("stroke","#179FAE");
		home.select("g.maison").selectAll("rect")
							   .attr("stroke","#179FAE");
		home.select("g.maison").selectAll("line")
							   .attr("stroke","#179FAE");		
		homerect.selectAll("rect")
				.attr("stroke","#179FAE")
				.attr("fill", "rgba(0,0,0,0)");
	});

	home.on("click", function (){
		self.location.href='index.html#title';
	});


	var evo = d3.selectAll("svg.evosvg");
	var evorect = evo.select("g.fondevo");

	evo.on("mouseover", function (){
		evo.select("g.gevo").selectAll("path")
							   .attr("stroke","#031d2a")
							   .attr("fill","#031d2a");
				
		evorect.selectAll("rect")
				.attr("stroke","#031d2a")
				.attr("fill", "#179FAE");
	});

	evo.on("mouseout", function (){
		evo.select("g.gevo").selectAll("path")
							   .attr("stroke","#179FAE")
							   .attr("fill","#179FAE");
	
		evorect.selectAll("rect")
				.attr("stroke","#179FAE")
				.attr("fill", "rgba(0,0,0,0)");
	});

	evo.on("click", function (){
		self.location.href='index.html#thirdPage';
	});

	var click = "sub";
	var sub = d3.selectAll("#choixsubvention");
	var rh = d3.selectAll("#choixrh");

	sub.on('mouseover', function (){
		if (click != "sub"){
			sub.style("background-color","white");
			sub.style("color","#179fae");
		}
	});

	sub.on('mouseout', function (){
		if (click != "sub"){
			sub.style("background-color","#02141e");
			sub.style("color","#324c5a");
		}
	});

	sub.on('click', function (){
		click = "sub";
		sub.style("background-color","white");
		sub.style("color","#179fae");
		rh.style("background-color","#02141e");
		rh.style("color","#324c5a");
	});

	rh.on('mouseover', function (){
		if (click != "rh"){
			rh.style("background-color","white");
			rh.style("color","#179fae");
		}
	});

	rh.on('mouseout', function (){
		if (click != "rh"){
			rh.style("background-color","#02141e");
			rh.style("color","#324c5a");
		}
	});

	rh.on('click', function (){
		click = "rh";
		rh.style("background-color","white");
		rh.style("color","#179fae");
		sub.style("background-color","#02141e");
		sub.style("color","#324c5a");
	});
});
