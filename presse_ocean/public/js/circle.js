/**
 * Created by Twilibri on 27/01/2016.
 */
"use strict";

function Circle(selector, w, h, maximum, init, type)
{

  this.width = w || 960;
  this.height = h || 800;
  this.radius = Math.min(this.width, this.height) / 1.9;
  this.spacing = .3;
  this.max = maximum * 1.1;
  this.selector = selector;

  this.global = (init >= 0 && init <= this.max) ? init : this.max / 2;

  var thisObj = this;

  /*
   var formatSecond = d3.time.format("%-S seconds"),
   formatMinute = d3.time.format("%-M minutes"),
   formatHour = d3.time.format("%-H hours"),
   formatDay = d3.time.format("%A"),
   formatDate = function (d) {
   d = d.getDate();
   switch (10 <= d && d <= 19 ? 10 : d % 10) {
   case 1:
   d += "st";
   break;
   case 2:
   d += "nd";
   break;
   case 3:
   d += "rd";
   break;
   default:
   d += "th";
   break;
   }
   return d;
   },
   formatMonth = d3.time.format("%B");
   */
  var formatRand = d3.format("%");

  if (type != undefined) {
    queue().defer(d3.json, "/media/data/data.json").await(ready.bind(this));
  } else {
    ready().bind(this);
  }

  function ready(error, data)
  {

    var range = [ "hsl(220,100%,100%)", "hsl(220,100%,75%)" ];

    if (data != undefined) {
      range = [
        d3.hsl(data.colors[type].range.shift()),
        d3.hsl(data.colors[type].range.pop())
      ];
    }

    var color = d3.scale.linear().range(range).interpolate(function(a, b) {
      var i = d3.interpolateHsl(a, b);
      return function(t) { return d3.hsl(i(t)); };
    });

    var arcBody =
      d3.svg.arc()
        .startAngle(0)
        .endAngle(function(d) { return d.value * 2 * Math.PI; })
        .innerRadius(function(d) { return d.index * thisObj.radius; })
        .outerRadius(function(d) {
          return (d.index + thisObj.spacing) * thisObj.radius;
        })
        .cornerRadius(6);

    var arcCenter = d3.svg.arc()
                      .startAngle(0)
                      .endAngle(function(d) { return d.value * 2 * Math.PI; })
                      .innerRadius(function(d) {
                        return (d.index + thisObj.spacing / 2) * thisObj.radius;
                      })
                      .outerRadius(function(d) {
                        return (d.index + thisObj.spacing / 2) * thisObj.radius;
                      });

    var svg = d3.select(thisObj.selector)
                .classed("svg-container",
                         true) // container class to make it responsive
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + thisObj.width + " " + thisObj.height)
                // class to make it responsive
                .classed("svg-content-responsive", true)
                .append("g")
                .attr("transform", "translate(" + thisObj.width / 2 + "," +
                                     thisObj.height / 2 + ")");

    var field = svg.selectAll("g").data(fields).enter().append("g");

    field.append("path").attr("class", "arc-body");

    field.append("path").attr("id", function(d, i) {
                          return "arc-center-" + type + "-" + i;
                        }).attr("class", "arc-center");

    field.append("text")
      .attr("dy", ".35em")
      .attr("dx", ".75em")
      .style("text-anchor", "start")
      .append("textPath")
      .attr("startOffset", "50%")
      .attr("class", "arc-text")
      .attr("xlink:href",
            function(d, i) { return "#arc-center-" + type + "-" + i; });

    tick();

    d3.select(self.frameElement).style("height", thisObj.height + "px");

    function tick()
    {
      var tmp;
      if (!document.hidden)
        field.each(function(d) { tmp = d.value; })
          .data(fields)
          .each(function(d) { d.previousValue = tmp; })
          .transition()
          .ease("elastic")
          .duration(5000)
          .each(fieldTransition);

      setTimeout(tick, 100 - Date.now() % 100);
    }

    function fieldTransition()
    {
      var field = d3.select(this).transition();

      field.select(".arc-body")
        .attrTween("d", arcTween(arcBody))
        .style("fill", function(d) { return color(d.value); });

      field.select(".arc-center").attrTween("d", arcTween(arcCenter));

      field.select(".arc-text").text(function(d) { return d.text; });
    }

    function arcTween(arc)
    {
      return function(d) {
        var i = d3.interpolateNumber(d.previousValue, d.value);
        return function(t) {
          d.value = i(t);
          return arc(d);
        };
      };
    }

    function fields()
    {
      return [
        {
          index : .6,
          text : formatRand(thisObj.global),
          value : thisObj.global / thisObj.max
        }
      ];
    }
  }
}

Circle.prototype.update = function(val) {
  this.global = val <= this.max ? val : this.global;
};
