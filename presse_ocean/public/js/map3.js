var map3 = new Map($("#map3-map"), $("#map3-2006"), $("#map3-2011"));
var circle3 = new Circle(
  d3.select("#map3-map").select(".sidebar").selectAll(".graph")[0][1], 200, 200,
  4.5, 0, "secondaires");
var hist_svg =
  d3.select("#map3-map").select(".sidebar").selectAll(".graph")[0][0];
var hist3 = new Histogram(hist_svg, [ 0 ], 250, 30, 30, 'secondaires');

var Map3_b2006 = function(event, data) {
  map3.update(null, data, 2006);
  hist3.update([ map3.selectionData.value2006 ]);
};

var Map3_b2011 = function(event, data) {
  map3.update(null, data, 2011);
  hist3.update([ map3.selectionData.value2011 ]);
};

var updater3 = function(data) {
  map3.onClick(data);
  if ($("#map3-2006").is("checked")) {
    Map3_b2006(data);
  } else {
    Map3_b2011(data);
  }
  circle3.update(data.evol);
};

loadMap(d3.select("#map3"), "secondaires", { onClick : updater3 });
$("#map3-2006").on('click', Map3_b2006);
$("#map3-2011").on('click', Map3_b2011);
