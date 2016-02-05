"use strict";

$(document)
  .ready(function() {

    var svg = d3.select("body")
                .append("div")
                .classed("svg-container", true)
                //.classed("background", true)
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 1280 720")
                // class to make it responsive
                .classed("svg-content-responsive", true);

    svg.append("svg:image")
      .attr("xlink:href", "/media/pic/Fond1.svg")
      .attr("width", 1280)
      .attr("height", 720)
      .attr("x", 0)
      .attr("y", 0);

    svg.append("svg:image")
      .attr("xlink:href", "/media/pic/cloud.svg")
      .classed("cloud", true)
      .attr("width", 110)
      .attr("height", 110)
      .attr("x", 700)
      .attr("y", 100);

    svg.append("svg:image")
      .attr("xlink:href", "/media/pic/cloud2.svg")
      .classed("cloud", true)
      .attr("width", 215)
      .attr("height", 165)
      .attr("x", 250)
      .attr("y", -17);

    svg.append("svg:image")
      .attr("xlink:href", "/media/pic/cloud.svg")
      .classed("cloud", true)
      .attr("width", 110)
      .attr("height", 110)
      .attr("x", 82)
      .attr("y", 302);

    var go = function() {
      d3.selectAll(".cloud")
        .transition()
        .attr("x", 2100)
        .attr("y", 1200)
        .duration(10000)
        .ease("linear")
        .each("end", back);
      //$(".cloud").animate({left: "+=2100", top: "+=1200"}, {duration: 60000,
      // queue: false, complete: back});
      // back(obj);
    };
    var back = function() {
      d3.selectAll(".cloud")
        .transition()
        .attr("x", -100)
        .attr("y", -100)
        .ease("linear")
        .each("end", go);
      //$(".cloud").animate({left: "-=2100", top: "-=1300"}, {duration: 1,
      // queue: false, complete: go});
      // go(obj);
    };

    go();

  });