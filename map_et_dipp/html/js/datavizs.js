var dataset = [5,10,15,20,25,12,45,6,78,5,8,6,4,9,15];


/*var svg = d3.select("#legumesJoseph").append("svg").attr("width", 500).attr("height",500);
var circles = svg.selectAll("circle").data(dataset).enter().append("circle");

circles.attr("cx", function(d,i){
	return (i*50)+25;
}).attr("cy", 50/2).attr("r",function(d){return d;}).attr("fill","yellow").attr("stroke","grey").attr("stroke-width",function(d){return d/2;});*/
var w = 500;
var h = 200;
var svg = d3.select("#legumesJoseph").append("svg").attr("width",w).attr("height",h);
svg.selectAll("rect").data(dataset).enter().append("rect").attr("x",function(d,i){
	return i*20;
}).attr("y",function(d){return h-d;}).attr("width",20).attr("height",function(d){return d;}).attr("fill",function(d){
	return "rgb("+(d*10)+",0,0)";
});
svg.selectAll("text").data(dataset).enter().append("text").text(function(d){return d;}).attr("x",function(d,i){return i*20;}).attr("y",function(d){return h-d+15;});