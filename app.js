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

STATS = (function() {
    "use strict";

    function mean(indicator) {
        var count;
        return Object.keys(window.data)
        .map(function (lsoa11cd) {
            count += 1;
            return window.data[lsoa11cd][indicator].raw;
        }).reduce(function (a, b) {
            return a + b;
        }) / count;
    }

    function max(indicator) {
        return Object.keys(window.data)
        .map(function (lsoa11cd) {
            return window.data[lsoa11cd][indicator].raw;
        }).reduce(function (max, a) {
            return a > max ? a : max;
        });
    }

    function min(indicator) {
        return Object.keys(window.data)
        .map(function (lsoa11cd) {
            return window.data[lsoa11cd][indicator].raw;
        }).reduce(function (max, a) {
            return a < max ? a : max;
        });
    }

    function median(indicator) {
        var values = Object.keys(window.data)
        .map(function (lsoa11cd) {
            return window.data[lsoa11cd][indicator].raw;
        }).sort(function (a, b) {
            return a - b;
        });

        return values[values.length() / 2];
    }
}());

(function() {
    "use strict";
    var NUMBER_LSOA = 32844;
    var INDICATORS = {
        crime: "Crime",
        income: "Income",
        employment: "Employment",
        education: "Education, Skills and Training",
        health: "Health Deprivation and Disability",
        housing: "Barriers to Housing and Services",
        environment: "Living Environment"
    };

    // Utility variable for mapping postcode to LSOA11CD
    function PCD_LSOA11CD_mapper(){
        var mapper = {};
        for (var LSOA11CD in window.data) {
            mapper[window.data.LSOA11CD.PCD7] = LSOA11CD;
        }
        return mapper;
    }

    function PCDtoLSOA11CD(PCD) {
        return mapper[PCD];
    }

    // Convert HSV to RGB
    function HSVtoRGB(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    // Convert RGB to HEX
    function RGBtoHEX(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function getColor(score) {
        //score = (score - 4) / 67 * 0xfffff;
        //return "#" + ("0" + Math.trunc(score)).slice(-6);
        score = (1 - (score - 4) / 67) / 6;
        var rgb = HSVtoRGB(score, 1, 1);
        return RGBtoHEX(rgb.r, rgb.g, rgb.b);
    }

    function expTransform(rank) {
        return -23 * Math.log(1 - rank / NUMBER_LSOA * (
            1 - Math.exp(-100/23)
        ))
    }

    window.calculateIMD = function(lsoa11cd) {
        var sum = 1;
        return Object.keys(INDICATORS).map(function(id) {
            var val = Number.parseFloat(document.getElementById(id).value);
            sum += val;
            return expTransform(window.data[lsoa11cd][id].rank) * val;
        }).map(function(val) {
            return val / sum;
        }).reduce(function(a, b) {
            return a + b;
        });
    }

    function style(feature) {
        var d = window.data[feature.properties.LSOA11CD];
        return {
            fillColor: getColor(d["IMD"]["raw"]),
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

        info.update(e.target.feature.properties);
    }

    function resetHighlight(e) {
        topoLsoaLayer.resetStyle(e.target);
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

    var topoLsoaLayer = new L.TopoJSON(window.topo_lsoa, {
        style: style,
        onEachFeature: onEachFeature
    });

    var osm = new L.TileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            minZoom: 11,
            maxZoom: 18,
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }
    );

    var map = L.map('map', {
        center: [53.85, -2.7],
        zoom: 11,
        layers: [osm, topoLsoaLayer],
        minZoom: 11,
        maxZoom: 18,
        maxBounds: topoLsoaLayer.getBounds()
    });

    L.control.layers({
        "Map": osm
    }, {
        "LSOA": topoLsoaLayer
    }).addTo(map);
    L.control.scale().addTo(map);

    var info = L.control();

    var sliderListenersAdded = false;
    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info');
        var info = L.control();
        this._div.innerHTML =
            '<h4>Index of Multiple Deprivation Score</h4>' +
            '<h4 id="idm"></h4> <br/>' +
            '<h5>How would you weight these factors ?</h5>' +
            '<div class="sliderset">' +
            '   <div class="row"></div><label>Income</label><input id="income" type="range" min="0" max="1000" value="225" class="slider red"/><br/>' +
            '   <div class="row"></div><label>Employment</label><input id="employment" type="range" min="0" max="1000" value="225" class="slider orange"/><br/>' +
            '   <div class="row"></div><label>Education</label><input id="education" type="range" min="0" max="1000" value="135" class="slider yellow"/><br/>' +
            '   <div class="row"></div><label>Health</label><input id="health" type="range" min="0" max="1000" value="135" class="slider green"/><br/>' +
            '   <div class="row"></div><label>Crime</label><input id="crime" type="range" min="0" max="1000" value="93" class="slider blue"/><br/>' +
            '   <div class="row"></div><label>Housing</label><input id="housing" type="range" min="0" max="1000" value="93" class="slider indigo"/><br/>' +
            '   <div class="row"></div><label>Environment</label><input id="environment" type="range" min="0" max="1000" value="93" class="slider purple"/><br/>' +
            '</div>';
        this._div.addEventListener('mousemove', function(e) {
            e.stopPropagation();
        });

        return this._div;
    };

    info.update = function(props) {

        if (sliderListenersAdded == false) {
            document.getElementById("income").addEventListener('change', function(e) {
                info.update(props)
            });
            document.getElementById("employment").addEventListener('change', function(e) {
                info.update(props);
            });
            document.getElementById("education").addEventListener('change', function(e) {
                info.update(props);
            });
            document.getElementById("health").addEventListener('change', function(e) {
                info.update(props);
            });
            document.getElementById("crime").addEventListener('change', function(e) {
                info.update(props);
            });
            document.getElementById("housing").addEventListener('change', function(e) {
                info.update(props);
            });
            document.getElementById("environment").addEventListener('change', function(e) {
                info.update(props);
            });
            sliderListenersAdded = true;
        }
        else if (props !== undefined) {
            document.getElementById("idm").innerHTML = ": " + calculateIMD(props["LSOA11CD"]).toFixed(1) + "%";
        }
    }

    info.addTo(map);
}())
