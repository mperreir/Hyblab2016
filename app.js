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
        var d = window.data[feature.properties.LSOA11CD];
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
        topoLayer.resetStyle(e.target);
    }

    function printName(e) {
        console.log(window.data[e.target.feature.properties.LSOA11CD]);
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: printName
        });
    }

    var map = L.map('map').setView([53.85, -2.7], 11);

    var topoLayer = new L.TopoJSON(window.topo, {
        style: style,
        onEachFeature: onEachFeature
    });
    topoLayer.addTo(map);
}())
