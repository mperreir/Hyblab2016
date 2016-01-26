var jsonCircle = [ 
{"x":30,"y":30,"r":15,"c":"green"},
{"x":50,"y":50,"r":20,"c":"red"},
{"x":85,"y":85,"r":25,"c":"yellow"}
];

var svgContainer = d3.select("body").append("svg")
                                    .attr("width", 200)
                                    .attr("height", 200);

var circles = svgContainer.selectAll("circle")
                          .data(jsonCircle)
                          .enter()
                          .append("circle");

var circleAttributes = circles
                       .attr("cx", function(d){ return d.x;}
                       .attr("cy", function(d){return d.y;})
                       .attr("r", function (d) { return d.r; })
                       .style("fill",function(d){return d.c;});