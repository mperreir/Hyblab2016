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
    function getColor(score) {
        score = (score - 4) / 67 * 0xfffff;
        return "#" + ("0" + Math.trunc(score)).slice(-6);
    }

    function style(feature) {
        var d = window.data.filter(function(item) {
            return feature.properties.LSOA11CD === item.LSOA11CD;
        })[0];
        return {
            fillColor: getColor(d["Index of Multiple Deprivation (IMD) Score"]),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        L.geoJson.resetStyle(e.target);
    }

    function printName(e) {
        console.log(e.target.feature.properties["Index of Multiple Deprivation (IMD) Score"]);
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: printName
        });
    }

    var map = L.map('map').setView([53.8, -2.7], 9);

    var topoLayer = new L.TopoJSON(window.topo, {
        style: style,
        onEachFeature: onEachFeature
    });
    topoLayer.addTo(map);
}())
