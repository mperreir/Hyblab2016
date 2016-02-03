const d3 = require('d3');
d3.tip = require('d3-tip');
const utils = require("./utils.js");

let tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.Date + "<br>" + d.NO2; });

d3.csv("per_month_centre.csv",(err,data_csv) => {
    let data = data_csv.map((datum) => {
        return {
            "Date":datum.Date,
            "NO":+datum.NO,
            "NO2":+datum.NO2,
            "PM25":+datum.PM25
        }
    });

    var width=950,
    	height=250;

    var chart = d3.select(".dataviz1")
    	.attr("width",width)
    	.attr("height",height);
    let scale_y = d3.scale.linear().range([height,0]).domain([0,utils.max_NO2]);
    let scale_x = d3.scale.ordinal().rangePoints([0, width],1).domain(data.map((d) => d.Date));

    chart.call(tip);

    var circles = chart.selectAll("circle").data(data);
    circles.enter().append("circle")
        .attr("cy", (d,i) => { return scale_y(d.NO2) })
        .attr("cx", (d,i) => { return scale_x(d.Date) })
        .attr("r", 6)
        .attr("class","dot_pollution")
        .each(function (d,i){
            d3.select(this)
                .classed(utils.pollution_classes.join(' '),false)
                .classed(utils.getPollutionCategory(d.NO2),true)
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
})
