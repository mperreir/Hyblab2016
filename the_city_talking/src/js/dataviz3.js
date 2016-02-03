const d3 = require('d3');
d3.tip = require('d3-tip');
const utils = require("./utils.js");
const moment = require('moment');

let dateLimits = [moment("2010-08"),moment("2015-10")] ;

let tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.Month + "<br>" + d.Cost; });

var width=500,
    height=250;

var chart = d3.select(".dataviz3")
    .attr("width",width)
    .attr("height",height);

chart.call(tip);

d3.csv("prescriptions.csv",(err,data_csv) => {
    let data = data_csv.map((datum) => {
        return {
            "Month":datum.Month,
            "Cost":+datum.Cost,
        }
    });
    let scale_y = d3.scale.linear().range([height,0]).domain([0,d3.max(data.map((d) => d.Cost))]);
    let scale_x = d3.scale.ordinal().rangePoints([0, width],1).domain(data.map((d) => d.Month));

    var circles = chart.selectAll("circle.prescription").data(data);
    circles.enter().append("circle")
        .attr("cy", (d,i) => { return scale_y(d.Cost) })
        .attr("cx", (d,i) => { return scale_x(d.Month) })
        .attr("r", 6)
        .classed("prescription",true)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
});

d3.csv("per_month_kerbside.csv",(err,data_csv) => {
    let data = data_csv.map((datum) => {
        return {
            "Date":moment(datum.Date,"MM-YYYY"),
            "NO":+datum.NO,
            "NO2":+datum.NO2,
            "PM25":+datum.PM25
        }
    }).filter((d) => { return d.Date.isAfter(dateLimits[0]) && d.Date.isBefore(dateLimits[1])});
    let scale_y = d3.scale.linear().range([height,0]).domain([0,d3.max(data.map((d) => d.NO2))]);
    let scale_x = d3.scale.ordinal().rangePoints([0, width],1).domain(data.map((d) => d.Date.format("MM-YYYY")));
    var circles = chart.selectAll("circle.pollution").data(data);
    circles.enter().append("circle")
        .attr("cy", (d,i) => { return scale_y(d.NO2) })
        .attr("cx", (d,i) => { return scale_x(d.Date.format("MM-YYYY")) })
        .attr("r", 6)
        .classed("pollution",true)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
});
