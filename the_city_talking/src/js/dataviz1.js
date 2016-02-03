const d3 = require('d3');
d3.tip = require('d3-tip');
const utils = require("./utils.js");

let tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return formatDateShow(d.Date) + "<br><strong>NO2 = " + d.NO2 + "</strong>"; });

var o_width=950,
	o_height=400;

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = o_width - margin.left - margin.right,
    height = o_height - margin.top - margin.bottom;

var formatDate = d3.time.format("%m-%Y");
var formatDateShow = d3.time.format("%B %Y");

d3.csv("per_month_kerbside.csv",(err,data_csv) => {
    let data = data_csv.map((datum) => {
        return {
            "Date":formatDate.parse(datum.Date),
            "NO":+datum.NO,
            "NO2":+datum.NO2,
            "PM25":+datum.PM25
        }
    });

    var chart = d3.select(".dataviz1")
	.attr("width",o_width)
	.attr("height",o_height);

	var min_NO2 = 20;
	var max_NO2 = 250;

    let scale_y = d3.scale.linear().range([height,0]).domain([min_NO2,max_NO2]);
    //let scale_x = d3.scale.ordinal().rangePoints([0, width],1).domain(data.map((d) => d.Date));
    let scale_x = d3.time.scale()
		.range([0,width]).domain(d3.extent(data,function(d){return d.Date;}))

    var xAxis = d3.svg.axis()
	    .scale(scale_x)
	    .orient("bottom");

	chart.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate("+margin.left+"," + height + ")")
      .call(xAxis);

    var line = d3.svg.line()
		.interpolate("cardinal")
	    .x(function(d) { return scale_x(d.Date); })
	    .y(function(d) { return scale_y(d.NO2); });

    chart.call(tip);

    function offsets(seuil,min,max)
    {
    	return (seuil/(max-min))*100;
    }

    var seuilmoyen=(100-offsets(110,min_NO2,max_NO2))+"%";
    var seuilmauvais=(100-offsets(200,min_NO2,max_NO2))+"%";

   	chart.append("linearGradient")                
        .attr("id", "line-gradient-d1")            
        .attr("gradientUnits", "userSpaceOnUse")    
        .attr("x1", 0).attr("y1", 0)         
        .attr("x2", 0).attr("y2", height)      
    .selectAll("stop")                      
        .data([                             
            {offset: "0%", color: "rgb(249,98,90)"},       
            {offset: seuilmauvais, color: "rgb(249,98,90)"},  
            {offset: seuilmauvais, color: "rgb(255,167,136)"},        
            {offset: seuilmoyen, color: "rgb(255,167,136)"},        
            {offset: seuilmoyen, color: "rgb(28,247,168)"},    
            {offset: "100%", color: "rgb(28,247,168)"}    
        ])                  
    .enter().append("stop")         
        .attr("offset", function(d) { return d.offset; })   
        .attr("stop-color", function(d) { return d.color; });  

    var path = chart.append("path")
    path.datum(data)
		.transition()
		.attr("d",line)
		.attr("transform","translate("+margin.left+",0)")
		.attr("class","line5y");

    var circles = chart.selectAll("circle").data(data);
    circles.enter().append("circle")
        .attr("cy", (d,i) => { return scale_y(d.NO2) })
        .attr("cx", (d,i) => { return scale_x(d.Date) })
        .attr("r", 3)
        .attr("transform","translate("+margin.left+",0)")
        .attr("class","dot_pollution")
        .each(function (d,i){
            d3.select(this)
                .classed(utils.pollution_classes.join(' '),false)
                .classed(utils.getPollutionCategory(d.NO2),true)
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

});
