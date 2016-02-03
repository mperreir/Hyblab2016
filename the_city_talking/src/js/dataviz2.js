const d3 = require('d3');
d3.tip = require('d3-tip');

var width=1000,
	height=400;

var chart = d3.select(".dataviz2")
	.attr("width",width)
	.attr("height",height);

let padding_y = 20 ;
let max_NO2 = 350 ;
let scale_y = d3.scale.linear().range([height,0]).domain([0,max_NO2]);
let scale_x = d3.scale.ordinal().rangePoints([0, width],0.5);

let months = ['01-2014','02-2014','03-2014','04-2014','05-2014','06-2014','07-2014','08-2014','09-2014','10-2014','11-2014','12-2014']
let current_month = 0 ;

let tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.NO2; });

let pollution_values = [0,110,200,max_NO2]
let pollution_classes = ['pollution_good','pollution_poor','pollution_terrible'];

function getPollutionCategory(value){
	for (var i = 1 ; i < pollution_values.length ; i++){
		if (value < pollution_values[i]){
			return pollution_classes[i-1];
		}
	}
}

chart.call(tip);

chart.selectAll('.bg_square').data(pollution_values.filter((d) => (d != max_NO2)))
	.enter()
	.append("rect")
	.classed('bg_square',true)
	.attr('x',0)
	.attr('y',(d,i) => scale_y(pollution_values[i+1]))
	.attr('width',width)
	.attr('height',(d,i) => scale_y(max_NO2 - (pollution_values[i+1]-pollution_values[i])))
	.each(function (d,i){d3.select(this).classed(pollution_classes[i],true)});

function loopMonth(){
	d3.json("json_kerbside/"+months[current_month]+".json",(err,data) => {
		scale_x = scale_x.domain(data.map((dataOneHour) => dataOneHour.Hour)) ;
		//scale_y = scale_y.domain(d3.extent(data.map((dataOneHour) => dataOneHour.NO2)));
		var circles = chart.selectAll("circle").data(data);
		circles.enter().append("circle")
			.attr("cy", (d,i) => { return scale_y(d.NO2) })
			.attr("cx", (d,i) => { return scale_x(d.Hour) })
			.attr("r", 10)
			.attr("class","dot_pollution")
			.each(function (d,i){
				d3.select(this)
					.classed(pollution_classes.join(' '),false)
					.classed(getPollutionCategory(d.NO2),true)
			})
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)

		circles
			.transition()
			.attr("cy", (d,i) => { return scale_y(d.NO2) })
			.attr("cx", (d,i) => { return scale_x(d.Hour) })
			.each(function (d,i){
				d3.select(this)
					.classed(pollution_classes.join(' '),false)
					.classed(getPollutionCategory(d.NO2),true)
			});
		current_month = (current_month + 1) % months.length ;
		setTimeout(loopMonth,2000);
	});
}

loopMonth();
