const d3 = require('d3');
import "../scss/main.scss";

function parseDay(d){
	return {
		"Hour":d.Hour,
		"NO":+d.NO,
		"NO2":+d.NO2,
		"PM25":+d.PM25,
	}
}

let width = 960,
	height = 500;

let y = d3.scale.linear()
	.range([height, 0]);

let chart = d3.select(".chart")
	.attr("width", width)
	.attr("height", height);

d3.csv("data/average_sun.csv",parseDay,(err,data) => {
	y.domain([0, d3.max(data, function(d) { return d.NO; })]);

	let barWidth = width / data.length;

	let bar = chart.selectAll("g")
		.data(data)
		.enter()
		.append("g")
		.attr("transform",(d, i) =>  "translate(" + i * barWidth + ",0)" );

	bar.append("rect")
		.attr("y", (d) => y(d.NO) )
		.attr("height", (d) =>  height - y(d.NO))
		.attr("width", barWidth - 1);
	/*
	bar.append("text")
		.attr("x", barWidth / 2)
		.attr("y", function(d) { return y(d.value) + 3; })
		.attr("dy", ".75em")
		.text(function(d) { return d.value; });
	});
	*/
});
