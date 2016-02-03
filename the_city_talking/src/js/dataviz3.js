const d3 = require('d3');
d3.tip = require('d3-tip');
const utils = require("./utils.js");
const moment = require('moment');

var formatDate = d3.time.format("%m-%Y");
var formatDatePres = d3.time.format("%Y-%m");
var formatDateShow = d3.time.format("%B %Y");

var o_width=950,
    o_height=300;

var margin = {top: 20, right: 20, bottom: 20, left: 50},
    width = o_width - margin.left - margin.right,
    height = o_height - margin.top - margin.bottom;

var chart = d3.select(".dataviz3")
    .attr("width",o_width)
    .attr("height",o_height);

function kform(origin)
{
    origin = ""+Math.floor(origin)
    return origin.substr(0,3)+"k";
}

let dateLimits = [formatDate.parse("08-2010"),formatDate.parse("10-2015")];

let tip_prescriptions = d3.tip().attr('class', 'd3-tip').html(function(d) { return formatDateShow(d.Month) + "<br><strong>Cost = £" + kform(d.Cost) + "</strong>"; });
let tip_pollution = d3.tip().attr('class', 'd3-tip').html(function(d) { return formatDateShow(d.Date) + "<br><strong>Pollution = " + d.NO2 + "</strong>"; });
chart.call(tip_prescriptions);
chart.call(tip_pollution);

d3.csv("prescriptions.csv",(err,data_csv) => {
    let data = data_csv.map((datum) => {
        return {
            "Month":formatDatePres.parse(datum.Month),
            "Cost":+datum.Cost,
        }
    });
    let scale_y = d3.scale.linear().range([height,0]).domain([0,d3.max(data.map((d) => d.Cost))]);
    let scale_x = d3.time.scale().range([0,width]).domain(d3.extent(data,function(d){return d.Month;}))

    var xAxis = d3.svg.axis()
        .scale(scale_x)
        .orient("bottom");

    chart.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate("+margin.left+", "+ (height+margin.top) + ")")
      .call(xAxis)
      .select("path")
      .attr("style","display:inline");

    let area = d3.svg.area()
        .x(function(d) { return scale_x(d.Month); })
        .y0(height)
        .y1(function(d) { return scale_y(d.Cost); });

    chart.append("path")
      .datum(data)
      .attr("class", "area_pres")   
      .attr("transform","translate("+margin.left+","+margin.top+")")
      .attr("d", area);

    var circles = chart.selectAll("circle.prescription").data(data);
    circles.enter().append("circle")
        .attr("cy", (d,i) => { return scale_y(d.Cost) })
        .attr("cx", (d,i) => { return scale_x(d.Month) })
        .attr("transform","translate("+margin.left+","+margin.top+")")
        .attr("r", 3)
        .classed("prescription",true)
        .on('mouseover', tip_prescriptions.show)
        .on('mouseout', tip_prescriptions.hide)
});

d3.csv("per_month_kerbside.csv",(err,data_csv) => {
    let data = data_csv.map((datum) => {
        return {
            "Date":formatDate.parse(datum.Date),
            "NO":+datum.NO,
            "NO2":+datum.NO2,
            "PM25":+datum.PM25
        }
    }).filter((d) => { return d.Date >= dateLimits[0] && d.Date <= dateLimits[1]});
    let scale_y = d3.scale.linear().range([height,0]).domain([0,d3.max(data.map((d) => d.NO2))]);
    let scale_x = d3.time.scale().range([0,width]).domain(d3.extent(data,function(d){return d.Date;}))

    let area = d3.svg.area()
        .x(function(d) { return scale_x(d.Date); })
        .y0(height)
        .y1(function(d) { return scale_y(d.NO2); });

    chart.append("path")
      .datum(data)
      .attr("class", "area_poll")   
      .attr("transform","translate("+margin.left+","+margin.top+")")
      .attr("d", area);

    var circles = chart.selectAll("circle.pollution").data(data);
    circles.enter().append("circle")
        .attr("cy", (d,i) => { return scale_y(d.NO2) })
        .attr("cx", (d,i) => { return scale_x(d.Date) })
        .attr("transform","translate("+margin.left+","+margin.top+")")
        .attr("r", 3)
        .classed("pollution",true)
        .on('mouseover', tip_pollution.show)
        .on('mouseout', tip_pollution.hide)
});