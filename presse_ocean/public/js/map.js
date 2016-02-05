"use strict";

var loadMap = function(selector, type, options) {

  // Map dimensions (in pixels)
  var width = (options != undefined && options.width != undefined)
                ? options.width
                : 1020,
      height = (options != undefined && options.height != undefined)
                 ? options.height
                 : 760;

  // Map projection

  var projection = d3.geo.mercator()
                     .scale(4100000)
                     .center([ 0, 0 ]) // projection center
                     .translate([
                       111150 + width / 2,
                       3843940 + height / 2
                     ]); // translate to center the map in view

  /*
   var projection = d3.geo.albers()
   .scale(600000)
   .parallels([50,52])
   .rotate([1.53,0])
   .center([0,51]);
   */

  // Generate paths based on projection
  var path = d3.geo.path().projection(projection);

  // Create an SVG
  var svg = selector.classed("svg-container",
                             true) // container class to make it responsive
              .append("svg")
              .attr("preserveAspectRatio", "xMinYMin meet")
              .attr("viewBox", "0 0 " + width + " " + height)
              // class to make it responsive
              .classed("svg-content-responsive", true);

  svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

  // Create zoom/pan listener
  // Change [1,Infinity] to adjust the min/max zoom scale
  /*
   var zoom = d3.behavior.zoom()
   .scaleExtent([1, 4])
   .on("zoom", zoomed);

   svg.call(zoom);
   */

  var active = d3.select(null);

  queue().defer(d3.json, "/media/data/data.json").await(ready);

  function ready(error, data)
  {

    var color = d3.scale.threshold()
                  .domain(data.colors[type].domain)
                  .range(data.colors[type].range);

    var labelColor = data.colors[type].label;

    data = data[type];

    var evolById = {};

    data.forEach(function(d) { evolById[d.id] = +d.evol; });

    // Group for the map features
    var features = svg.append("g").attr("class", "features");

    var texts = svg.append("g").attr("class", "texts");

    // Map Loading
    d3.json("vis/newMap.topo.json", function(error, geodata) {
      if (error)
        return console.log(error); // unknown error, check the console

      // Create a path for each map feature in the data
      features.selectAll("path")
        .data(topojson.feature(geodata, geodata.objects.collection)
                .features) // generate features from TopoJSON
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill",
               function(d) {
                 return d.properties["DEPCOMIRIS"] === 0
                          ? "#006079"
                          : color(evolById[d.properties["DEPCOMIRIS"]]);
               })
        .attr("id", function(d) { return "path" + d.properties["DEPCOMIRIS"]; })
        .on("click", clicked)
        .on("mouseover", hover)
        .on("mouseout", hoverout);

      texts.selectAll("path")
        .data(topojson.feature(geodata, geodata.objects.collection).features)
        .enter()
        .append("text")
        .attr("x",
              function(d) {
                var bbox =
                  d3.select("path#path" + d.properties["DEPCOMIRIS"])[0][0]
                    .getBBox();
                return bbox.x + bbox.width / 2
              })
        .attr("y",
              function(d) {
                var bbox =
                  d3.select("path#path" + d.properties["DEPCOMIRIS"])[0][0]
                    .getBBox();
                return bbox.y + bbox.height / 2
              })
        .attr("dy",
              function(d) {

                switch (d.properties["DEPCOMIRIS"]) {
                  case 4410906: // Ile de Nantes
                    return "2px";
                    break;
                  case 4410904: // Hauts Paves Saint Felix
                    return "1px";
                    break;
                  case 4410902: // Bellevue Chantenay Sainte Anne
                    return "-1px";
                    break;
                  default:
                    return 0;
                    break;
                }
              })
        .attr("fill",
              function(d) {
                return d.properties["DEPCOMIRIS"] === 0 ? "transparent"
                                                        : d3.rgb(labelColor);
              })
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("xlink:href",
              function(d) { return "#path" + d.properties["DEPCOMIRIS"]; })
        .text(function(d) { return d.properties["NAME"]; })
        .call(wrap, 50)
        .on("click", clicked);

      d3.select("#random").on("click", redrawRandom);

      function redrawRandom()
      {

        var features = d3.select("g.features");

        d3.json("vis/grdquartier.topo.json", function(error, geodata) {
          if (error)
            return console.log(error); // unknown error, check the console

          features.selectAll("path")
            .data(topojson.feature(geodata, geodata.objects.collection)
                    .features) // generate features from TopoJSON
            //.enter()
            .style("fill", function(d) { return color(Math.random() / 5); });

        });
      }
    });

    // Add optional onClick events for features here
    // d.properties contains the attributes (e.g. d.properties.name,
    // d.properties.population)
    function clicked(d, i)
    {
      if (d.properties["DEPCOMIRIS"] == 0)
        return;

      // if (active.node() === this) return reset();
      active.classed("active", false);

      if (d3.select(this).attr("id") != undefined) {
        active = d3.select(this).classed("active", true);
      } else {
        active =
          d3.select(d3.select(this).attr("href")).classed("active", true);
      }

      if (options != undefined && options.onClick != undefined) {
        var info = $.grep(
          data, function(e) { return e.id == d.properties["DEPCOMIRIS"] });
        options.onClick(info[0]);
      }
    }
  }

  // -*-*-[FUNCTIONS]-*-*-

  function hover(d, i)
  {
    if (d.properties["DEPCOMIRIS"] == 0)
      return;
    if (active.node() === this)
      return;
    d3.select(this).classed("hover", true);
  }

  function hoverout(d, i)
  {
    if (d.properties["DEPCOMIRIS"] == 0)
      return;
    d3.select(this).classed("hover", false);
  }

  // Update map on zoom/pan
  function zoomed()
  {
    /*
     features.attr("transform", "translate(" + zoom.translate() + ")scale(" +
     zoom.scale() + ")")
     .selectAll("path").style("stroke-width", 1 / zoom.scale() + "px" );
     */
  }

  function reset()
  {
    // active.classed("active", false);
    // active = d3.select(null);
  }

  function wrap(text, width)
  {
    text.each(function() {
      var text = d3.select(this), words = text.text().split(/\s+/).reverse(),
          word, line = [], lineNumber = 0,
          lineHeight = 1.1, // ems
        y = text.attr("y"), x = text.attr("x"),
          dy = parseFloat(text.attr("dy")) || 0,
          tspan =
            text.text(null).append("tspan").attr("x", x).attr("y", y).attr(
              "dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [ word ];
          tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
        }
      }
    });
  }
};