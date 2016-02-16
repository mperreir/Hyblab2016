/*jshint*/
/*global d3:false, queue:false*/
"use strict";

function text_transistion(svg, new_data, scale, bar_height)
{
  svg.selectAll("text")
    .data(new_data)
    .transition()
    .duration(500)
    .ease("log")
    .text(function(d) { return d + "%"; })
    .attr("x",
          function(d) { return scale.x(d) + 20 + (d.toString().length * 2); })
    .attr("y", function(d, i) { return i * bar_height + bar_height / 2; })
    .attr("dy", ".35em");
}

function rect_transition(svg, new_data, color, scale, bar_height, value_max)
{
  svg.selectAll("rect")
    .data(new_data)
    .transition()
    .duration(500)
    .ease("linear")
    .attr("width", scale.x)
    .attr("height", bar_height - 1)
    .attr("transform",
          function(d, i) { return "translate(0," + i * bar_height + ")"; })
    .style("fill", function(d) { return color(d / value_max); });
}

function add_text(svg, dataset, scale, bar_height)
{
  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) { return d + "%"; })
    .attr("text-anchor", "middle")
    .attr("x",
          function(d) { return scale.x(d) + 20 + (d.toString().length * 2); })
    .attr("y", function(d, i) { return i * bar_height + bar_height / 2; })
    .attr("dy", ".35em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "black");
}

function add_rect(svg, dataset, scale, bar_height)
{
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("width", scale.x)
    .attr("height", bar_height - 1)
    .attr("transform",
          function(d, i) { return "translate(0," + i * bar_height + ")"; })
    .style("fill", "red");
}

// TODO : corriger le bug avec -1 en max
function Histogram(id, dataset, w, h, max, color_type)
{ // jshint ignore:line
  this.width = w;
  this.height = h;
  this.value_max = max;
  this.scale = get_scale(w, h, dataset, max);
  var range = [ "hsl(220,100%,100%)", "hsl(220,100%,75%)" ];
  var thisObject = this;
  queue()
    .defer(d3.json, "media/data/data.json")
    .await(function(error, data) {
      range = [
        d3.rgb(data.colors[color_type].range[0]),
        d3.rgb(data.colors[color_type].range[3])
      ];
      var color = d3.scale.linear().range(range).interpolate(function(a, b) {
        var i = d3.interpolateRgb(a, b);
        return function(t) { return d3.hsl(i(t)); };
      });

      // Create SVG element
      thisObject.svg = d3.select(id)
                         .append("svg")
                         .attr("width", w)
                         //.attr("width", "100%")
                         .attr("height", h);

      thisObject.bar_height = Math.floor(h / dataset.length);

      add_rect(thisObject.svg, dataset, thisObject.scale,
               thisObject.bar_height);
      add_text(thisObject.svg, dataset, thisObject.scale,
               thisObject.bar_height);

      thisObject.update = function(new_data) {
        console.log(new_data);
        rect_transition(thisObject.svg, new_data, color, thisObject.scale,
                        thisObject.bar_height, thisObject.value_max);

        // Update all labels
        text_transistion(thisObject.svg, new_data, thisObject.scale,
                         thisObject.bar_height);
      };
    });
}

function get_scale(width, height, data, max)
{
  var max_ = d3.max(data);
  if (max > 0)
    max_ = max;
  return {
    y : d3.scale.ordinal()
          .domain(d3.range(data.length))
          .rangeRoundBands([ 0, height ], 0.05),
    x : d3.scale.linear().domain([ 0, max_ ]).range([ 0, width ])
  };
}
