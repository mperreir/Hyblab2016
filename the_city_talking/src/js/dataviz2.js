const d3 = require('d3');
d3.tip = require('d3-tip');
const utils = require("./utils.js");

var o_width=600,
	o_height=280;

var margin = {top: 20, right: 20, bottom: 20, left: 50},
    width = o_width - margin.left - margin.right,
    height = o_height - margin.top - margin.bottom;

var chart = d3.select(".dataviz2")
	.attr("width",o_width)
	.attr("height",o_height);

var formatDate = d3.time.format("%H\:00");

let padding_y = 20 ;

let scale_y = d3.scale.linear().range([height,0]).domain([0,utils.max_NO2]);
let scale_x = d3.time.scale().range([0,width]).domain([formatDate.parse("01:00"),formatDate.parse("24:00")]);

//let scale_x = d3.scale.ordinal().rangePoints([0, width],0.5);

let months = [
	{short:'J',name:"January",uri:'01'},
	{short:'F',name:"February",uri:'02'},
	{short:'M',name:"March",uri:'03'},
	{short:'A',name:"April",uri:'04'},
	{short:'M',name:"May",uri:'05'},
	{short:'J',name:"June",uri:'06'},
	{short:'J',name:"July",uri:'07'},
	{short:'A',name:"August",uri:'09'},
	{short:'S',name:"September",uri:'08'},
	{short:'O',name:"October",uri:'10'},
	{short:'N',name:"November",uri:'11'},
	{short:'D',name:"December",uri:'12'}];
let years = [2010,2011,2012,2013,2014,2015]
let facilities = [
	{short:"C",name:"Centre",uri:"json_centre/"},
	{short:"H K",name:"Headingley Kerbside",uri:"json_kerbside/"}]
let current_month = 0 ;
let current_year = 0 ;
let current_facility = 0 ;

let tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.NO2; });

function getPollutionCategory(value){
	for (var i = 1 ; i < utils.pollution_values.length ; i++){
		if (value < utils.pollution_values[i]){
			return utils.pollution_classes[i-1];
		}
	}
}

chart.call(tip);

chart.append("text")
	.attr("x",5+margin.left)
	.attr("y",5+margin.top)
	.attr("id","tooltip-d2")
	.text("");

var line = d3.svg.line()
	.interpolate("cardinal")
	.x(function(d) { return scale_x(d.Hour); })
	.y(function(d) { return scale_y(d.NO2); });

chart.select("#line-gradient-d3")                          
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", 0).attr("y2", height)
    .selectAll("stop")
        .data([
            {offset: "0%", color: "rgb(249,98,90)"},
            {offset: "30%", color: "rgb(249,98,90)"},
            {offset: "30%", color: "rgb(255,167,136)"},
            {offset: "60%", color: "rgb(255,167,136)"},
            {offset: "60%", color: "rgb(28,247,168)"},
            {offset: "100%", color: "rgb(28,247,168)"}
        ])
    .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });
/*
chart.selectAll('.bg_square').data(utils.pollution_values.filter((d) => (d != utils.max_NO2)))
	.enter()
	.append("rect")
	.classed('bg_square',true)
	.attr('x',0)
	.attr('y',(d,i) => scale_y(utils.pollution_values[i+1]))
	.attr('width',width)
	.attr('height',(d,i) => scale_y(utils.max_NO2 - (utils.pollution_values[i+1]-utils.pollution_values[i])))
	.each(function (d,i){d3.select(this).classed(utils.pollution_classes[i],true)});
*/
var path = chart.append("path")



var xAxis = d3.svg.axis()
    .scale(scale_x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(scale_y)
    .orient("left");

chart.append("g")
  .attr("class", "x_axis")
  .attr("transform", "translate("+margin.left+"," + (height) + ")")
  .call(xAxis);

chart.append("g")
  .attr("class", "y_axis")
  .attr("transform","translate("+margin.left+",0)")
  .call(yAxis)
.append("text")
  .attr("transform", "translate(-"+margin.left+","+height/3+") rotate(-90)")
  .attr("y",0)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Air Quality");

function updateChart(month_n = null ,year_n = null ,facility_n = null ,loop = true){
	facility_n = facility_n || current_facility ;
	month_n = month_n || current_month ;
	year_n = year_n || current_year ;
	if (loop !== true){
		loopMonth = () => {} ;
	}
	d3.json(facilities[facility_n].uri+months[month_n].uri+"-"+years[year_n]+".json",(err,json) => {
		//scale_x = scale_x.domain(data.map((dataOneHour) => dataOneHour.Hour)) ;
		let data=json.map(function(d){return {"Hour":formatDate.parse(d.Hour),"NO2":d.NO2}});
		//scale_y = scale_y.domain(d3.extent(data.map((dataOneHour) => dataOneHour.NO2)));
		var circles = chart.selectAll("circle").data(data);
		circles.enter().append("circle")
			.attr("cx", (d,i) => { return scale_x(d.Hour); })
			.attr("cy", (d,i) => { return scale_y(d.NO2) })
			.attr("r", 3)
			.attr("transform","translate("+margin.left+","+margin.top+")")
			.attr("class","dot_pollution")
			.each(function (d,i){
				d3.select(this)
					.classed(utils.pollution_classes.join(' '),false)
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
					.classed(utils.pollution_classes.join(' '),false)
					.classed(getPollutionCategory(d.NO2),true)
			});

		chart.select("text#tooltip-d2")
			.text(months[current_month].name+" "+years[current_year]+", "+facilities[current_facility].name+" facility")

	    path.datum(data)
			.transition()
			.attr("d",line)
			.attr("transform","translate("+margin.left+","+margin.top+")")
			.attr("class","line5y");

	});
}

function selectMonth(n){
	current_month = n ;
	updateChart();
}

function selectYear(n){
	current_year = n ;
	updateChart();
}

function selectFacility(n){
	current_facility = n ;
	updateChart();
}

updateChart();

months.forEach((e,i) => {
	var option = document.createElement("option");
	option.innerHTML = e.name ;
	option.setAttribute("title",e.name);
	option.addEventListener("click",selectMonth.bind(null,i));
	document.getElementById("select_dataviz2_months").appendChild(option);
})

years.forEach((e,i) => {
	var option = document.createElement("option");
	option.innerHTML = e ;
	option.addEventListener("click",selectYear.bind(null,i));
	document.getElementById("select_dataviz2_years").appendChild(option);
})
facilities.forEach((e,i) => {
	var option = document.createElement("option");
	option.innerHTML = e.name ;
	option.setAttribute("title",e.name);
	option.addEventListener("click",selectFacility.bind(null,i));
	document.getElementById("select_dataviz2_facilities").appendChild(option);
});
