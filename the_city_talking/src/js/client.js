const d3 = require('d3');
import "../scss/main.scss";

var width=1000,
	height=400;

var chart = d3.select(".chart")
	.attr("width",width)
	.attr("height",height);

var formatDate = d3.time.format("%d-%m-%Y");

function type(d) {
  d.date = formatDate.parse(d.date);
  d.no2 = +d.no2;
  return d;
}

var x = d3.time.scale()
	.range([0,width]);

var y = d3.scale.linear()
	.range([height,0]);

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.no2); });

d3.csv("per_day_test.csv",type,function(error,data){
	if (error) throw error;

	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain(d3.extent(data, function(d) { return d.no2; }));

	chart.append("path")
		.datum(data)
		.attr("d",line)
		.attr("class","lineb")
		.transition()
		.delay(500)
		.attr("class","line")
});
