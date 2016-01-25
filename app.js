L.TopoJSON = L.GeoJSON.extend({
    addData: function(jsonData) {
        if (jsonData.type === "Topology") {
            for (key in jsonData.objects) {
                geojson = topojson.feature(jsonData, jsonData.objects[key]);
                L.GeoJSON.prototype.addData.call(this, geojson);
            }
        }
        else {
            L.GeoJSON.prototype.addData.call(this, jsonData);
        }
    }
});


(function() {
    var map = L.map('map').setView([53.8, -2.7], 9);

    var topoLayer = new L.TopoJSON();
    topoLayer.addData(window.topo);
    topoLayer.addTo(map);
}())
