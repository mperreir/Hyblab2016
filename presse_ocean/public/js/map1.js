var map1 = new Map($("#map1-map"));
var circle1 = new Circle(
  d3.select("#map1-map").select(".sidebar").selectAll(".graph")[0][1], 200, 200,
  .15, 0, "logements");
var hist = new Histogram(
  d3.select("#map1-map").select(".sidebar").selectAll(".graph")[0][0], [ 0 ],
  250, 30, 20, 'logements');

var Map1_b2006 = function(event, data) {
  map1.update(null, data, 2006);
  hist.update([ map1.selectionData.value2006 ]);
};

var Map1_b2011 = function(event, data) {
  map1.update(null, data, 2011);
  hist.update([ map1.selectionData.value2011 ]);
};

var updater1 = function(data) {
  map1.onClick(data);
  if ($("#map1-2006").is("checked")) {
    Map1_b2006(data);
  } else {
    Map1_b2011(data);
  }
  circle1.update(data.evol);
};

loadMap(d3.select("#map1"), "logements", { onClick : updater1 });

$("#map1-2006").on('click', Map1_b2006);
$("#map1-2011").on('click', Map1_b2011);
