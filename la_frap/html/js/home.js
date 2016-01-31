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
		self.location.href='index.html#title'
	});

});
