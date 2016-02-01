const d3 = require('d3');
import "../scss/main.scss";

var width=1000,
	height=400;

var chart = d3.select(".chart")
	.attr("width",width)
	.attr("height",height);

let padding_y = 20 ;
let scale_y = d3.scale.linear().range([height-padding_y,padding_y]);
let scale_x = d3.scale.ordinal().rangePoints([0, width],0.5);

let months = ['01-2014','02-2014','03-2014','04-2014','05-2014','06-2014','07-2014','08-2014','09-2014','10-2014','11-2014','12-2014']
let current_month = 0 ;
function loopMonth(){
	d3.json("json_centre/"+months[current_month]+".json",(err,data) => {
		scale_x = scale_x.domain(data.map((dataOneHour) => dataOneHour.Hour)) ;
		scale_y = scale_y.domain(d3.extent(data.map((dataOneHour) => dataOneHour.NO2)));
		var circles = chart.selectAll("circle").data(data);
		circles.enter().append("circle")
			.attr("cy", (d,i) => { return scale_y(d.NO2) })
			.attr("cx", (d,i) => { return scale_x(d.Hour) })
			.attr("r", 10)
			.classed("dot_pollution",true)

		circles
			.attr("cy", (d,i) => { return scale_y(d.NO2) })
			.attr("cx", (d,i) => { return scale_x(d.Hour) })
		current_month = (current_month + 1) % months.length ;
		setTimeout(loopMonth,2000);
	});
}

loopMonth();
