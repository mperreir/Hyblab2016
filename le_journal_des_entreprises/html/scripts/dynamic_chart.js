"use strict";

var plateform = ["Wiseed", "Anaxago", "Smart Angels", "Sowefund", "AB Funding", "Bulb in Town", "Happy Capital", "Proximéa", "Raizers", "Letitseed"];
var subscribersCount = [59000, 55000, 18000, 0, 0, 200000, 20000, 1000, 10000, 0];
var totalFunds = [40100000, 37590139, 14515496, 2383977, 1291998, 2376770, 1947026, 1816782, 1059531, 1170250];
var meanTicket = [2000, 10500, 15000, 800, 8000, 0, 4200, 4500, 6000, 50];
var successRate = [75, 72, 85, 100, 80, 100, 42, 100, 66, 50];
var acceptRate = [5, 3, 5, 4.5, 2, 1, 2, 1, 1.5, 5];

var unit = " ";

var boardZoomed = false;
var jumped = false;

function inferiorValues(rank, array) {
	var n = 0;
	for (var i=0; i<array.length; i++) {
		if (array[i] > array[rank]) {
			n++;
		}
		else if (array[i] == array[rank] && i < rank) {
			n++;
		}
	}
	
	return n;
}

function stat(data, rank) {
	for (var i=0; i<10; i++) {
		rank[i] = inferiorValues(i, data);
	}
}

function zoomBoard(event) {
	var coef = 0;
	var target = 1.5;
	var delta = 0.1;
	if (boardZoomed) {
		coef = 1.5;
		target = 0;
		delta = -0.1;
	}
	
	boardZoomed = !boardZoomed;
	
	var timer = setInterval(zoomer, 16, target, delta);
	var targetWidth = 400;
	
	var chartDiv = document.getElementById("chartZone");
	var boardZone = document.getElementById("boardZone");
	
	if (!boardZoomed) 
		{document.getElementById("filterSelector").style.display = "none";}
	else
		{document.getElementById("filterSelector").style.display = "inline-block";}
	function zoomer(target, delta) {
		if (Math.abs(coef-target) < 0.1) {
			clearInterval(timer);
			boardZone.style.width = (1+target)*276+"px";
			boardZone.style.height = (1+target)*660+"px";
			
			boardZone.style.marginTop = target*10+"px";
			boardZone.style.marginLeft = 10+target*5+"%";
			chartDiv.style.width = target*670+"px";
			boardZone.style.boxShadow = "0px 100px "+(target*100)+"px black";
		} else {
			coef += (target-coef)/4.0;
			
			boardZone.style.width = (1+coef)*276+"px";
			boardZone.style.height = (1+coef)*660+"px";
			
			boardZone.style.marginTop = coef*10+"px";
			boardZone.style.marginLeft = 10+coef*5+"%";

			chartDiv.style.width = coef*670+"px";
			boardZone.style.boxShadow = "0px 100px "+(coef*100)+"px black";
		}
	}
}

function updateData(data, rank) {	
	x = d3.scale.linear()
		.domain([0, d3.max(data)])
		.range([0, width]);
			
	chart.selectAll("rect")
		.data(data)
		.transition()
		.duration(500)
		.attr('opacity', 1)
		.attr("width", x)
		.attr("y", function(d, i) { return rank[i] * (barHeight + heightMargin); })
		
	chart.selectAll("text")
		.data(data)
		.transition()
		.duration(500)
		.style('fill', 'white')
		.attr('opacity', function (d, i) {
			if (rank[i] < 3) { return 1; }
			return 0;
		})
		.attr("y", function(d, i) {
			var first = 1;
			if (rank[i] < 3) first = 0;
			return (rank[i]+first) * (barHeight + heightMargin) + barHeight/2; })
		.text(function(d, i) { return plateform[i]; });
};

function jump() {
	function jumper() {
		if (t >= pi) {
			clearInterval(timer);
			jumped = false;
			boardZone.style.marginTop = "0";
		}
		
		boardZone.style.marginTop = 50*Math.sin(t)*Math.sin(t)*Math.sin(t)+"px";
		t += 0.1;
	}
		
	if (!jumped && !boardZoomed)
	{
		jumped = true;
		var boardZone = document.getElementById("boardZone");
		var timer = setInterval(jumper, 16);
		var t = 0;
		var pi = 3.14159;
	}
}

function changeData(event, newData, newUnit) {
	unit = newUnit;
	data = newData;
	stat(data, rank);
	updateData(data, rank);
	
	if (event) {
		event.cancelBubble = true;
	}
}

function changeHeight(rect, indice) {
	d3.selectAll('rect')
		.transition()
		.duration(300)
		.attr("y", function(d, i) {
				var currentHeight = rank[i] * (barHeight+heightMargin);
				if (rank[i] > rank[indice]) {
					return currentHeight + barHeight;
				}
				
				return currentHeight;
			}
		)
		.attr("opacity", function(d, i) {
				if (i != indice) { return 0.4; }
				return 1;
			}
		);
		
	d3.select("#platform").selectAll('text')
		.transition()
		.attr("opacity", function(d, i) {
				if (i != indice) { return 0; }
				return 1;
			}
		)
		.attr("y", function(d, i) {
				var currentHeight = rank[i] * (barHeight+heightMargin);
				return currentHeight + barHeight*1.5;
			}
		)
		.text(function(d, i) { return plateform[i]+space+d+" "+unit; })
		.style('fill', 'black');
		
}

var space = " . . . . . . . ";

var rank = [];
var color = [];
var data = subscribersCount;
stat(data, rank);

var width, height;
var barHeight = 38;
var heightMargin = 1;

var margin = {top: 10, right: 5, bottom: 5, left: 10},
width = 560;
height = 100;

var x = d3.scale.linear()
	.domain([0, d3.max(data)])
	.range([0, width]);
		
var chart = d3.select("#presentation").selectAll(".chart")
	.attr("width", "100%")
	.attr("height", "100%");
	
var bar = chart.selectAll("g")
	.data(data)
	.enter()
	.append("g")
	.attr("transform", "translate(" + (margin.left) + "," + margin.top + ")")
	.on("mouseover", function(d, i) {changeHeight(d3.select(this), i);})
	.on("mouseleave", function(d, i) {changeData(null, data, unit);});


bar.append("rect")
	.attr("class", "chartRect")
	.attr("width", x)
	.attr("fill", "steelblue")
	.attr("height", barHeight - 1)
	.attr("x", 0)
	.attr("y", function(d, i) { return rank[i] * (barHeight+heightMargin); })
	.style('boxShadow', '0px 5px 30px');

bar.append("text")
	.attr("x", 10)
	.attr('opacity', function (d, i) {
			if (rank[i] < 3) { return 1; }
			return 0;
		})
	.attr("y", function(d, i) { return (rank[i]) * (barHeight + heightMargin) + barHeight/2; })
	.attr("dy", ".35em")
	.attr("class", "text")
	.style('fill', 'white')
	.style('font-weight', 'bold')
	.text(function(d, i) { return plateform[i]; });

var widthScreen = window.innerWidth
var heightScreen = window.innerHeight;

var i = 0;

var x = widthScreen/2;
var y = heightScreen/2;

var circle1 = d3.select("#rotatingCircle1");
var circle2 = d3.select("#rotatingCircle2");

console.log(x+" "+y);

setInterval(function() {
	circle1.attr("transform", "rotate("+ i +", "+222+", "+222+")");
	circle2.attr("transform", "rotate("+ -2*i +", "+230+", "+230+")");
	
	i++;
}, 16);