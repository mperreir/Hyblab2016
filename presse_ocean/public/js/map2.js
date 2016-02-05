var map2 = new Map($("#map2-map"), $("#map2-2006"), $("#map2-2011"));
var circle2 = new Circle(
  d3.select("#map2-map").select(".sidebar").selectAll(".graph")[0][1], 200, 200,
  .2, 0, "locataires");
var hist2 = new Histogram(
  d3.select("#map2-map").select(".sidebar").selectAll(".graph")[0][0], [ 0 ],
  250, 30, 50, 'locataires');

var Map2_b2006 = function(event, data) {
  map2.update(null, data, 2006);
  hist2.update([ map2.selectionData.value2006 ]);
};

var Map2_b2011 = function(event, data) {
  map2.update(null, data, 2011);
  hist2.update([ map2.selectionData.value2011 ]);
};

var updater2 = function(data) {
  map2.onClick(data);
  if ($("#map2-2006").is("checked")) {
    Map2_b2006(data);
  } else {
    Map2_b2011(data);
  }
  circle2.update(data.evol);
};

loadMap(d3.select("#map2"), "locataires", { onClick : updater2 });
$("#map2-2006").on('click', Map2_b2006);
$("#map2-2011").on('click', Map2_b2011);
