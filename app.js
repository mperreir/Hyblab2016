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

    function meanLSOAs(indicator, LSOAs) {
        var count = 0;
        var result = LSOAs
                .map(function (lsoa11cd) {
                    count += 1;
                    return window.data[lsoa11cd][indicator].raw;
                }).reduce(function (a, b) {
                    return a + b;
                }) / count;
        return result;
    }

    // Utility variable for storing MSOA's properties
    var MSOA = {};
    (function() {
        var g = topo_msoa.objects.E07000123.geometries;
        for (var i in g) {
            MSOA[g[i].properties.MSOA11CD] = { "LSOAs" : [] };
        }
    }());
    (function() {
        for (var LSOA11CD in window.data) {
            var MSOA11CD = window.data[LSOA11CD]["MSOA11CD"];
            MSOA[MSOA11CD]["LSOAs"].push(LSOA11CD);
        }
    }());
    (function(){
        for (var MSOA11CD in MSOA) {
            var count = 0;
            MSOA[MSOA11CD]["IMD"] = MSOA[MSOA11CD]["LSOAs"]
                    .map(function (lsoa11cd) {
                        count += 1;
                        return window.data[lsoa11cd]["IMD"]["raw"];
                    }).reduce(function (a, b) {
                        return a + b;
                    }) / count;
            for (var indicator in INDICATORS) {
                MSOA[MSOA11CD][indicator] = meanLSOAs(indicator, MSOA[MSOA11CD]["LSOAs"]);
            }
        }
    }());

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
        score = (1 - score / 100) / 6;
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
    };

    window.calculateMsoaIMD = function(msoa11cd) {
        var LSOAs = MSOA[msoa11cd]["LSOAs"];
        return LSOAs
            .map(calculateIMD)
            .reduce(function(a, b){return a + b;}) / LSOAs.length;
    };

    var hasInitializedStyle = false;
    function LsoaStyle(feature) {
        if (!hasInitializedStyle) {
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
        else {
            return {
                fillColor: getColor(calculateIMD(feature.properties.LSOA11CD)),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
    }

    function MsoaStyle(feature) {
        if (!hasInitializedStyle) {
            return {
                fillColor: getColor(MSOA[feature.properties.MSOA11CD]["IMD"]),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
        else {
            return {
                fillColor: getColor(calculateMsoaIMD(feature.properties.MSOA11CD)),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }
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

    function LsoaResetHighlight(e) {
        topoLsoaLayer.resetStyle(e.target);
    }

    function MsoaResetHighlight(e) {
        topoMsoaLayer.resetStyle(e.target);
    }

    function LsoaPrintName(e) {
        console.log(window.data[e.target.feature.properties.LSOA11CD]);
    }

    function MsoaPrintName(e) {
        console.log(window.data[e.target.feature.properties.MSOA11CD]);
    }

    function LsoaOnEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: LsoaResetHighlight,
            click: LsoaPrintName
        });
    }

    function MsoaOnEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: MsoaResetHighlight,
            click: MsoaPrintName
        });
    }

    var topoLsoaLayer = new L.TopoJSON(window.topo_lsoa, {
        style: LsoaStyle,
        onEachFeature: LsoaOnEachFeature
    });

    var topoMsoaLayer = new L.TopoJSON(window.topo_msoa, {
        style: MsoaStyle,
        onEachFeature: MsoaOnEachFeature
    });
    /*
    var osm = new L.TileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            minZoom: 11,
            maxZoom: 18,
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }
    );*/

    var map = L.map('map', {
        center: [53.85, -2.7],
        zoom: 11,
        layers: [topoMsoaLayer], // Only Add default layers here
        minZoom: 11,
        maxZoom: 18,
        maxBounds: topoMsoaLayer.getBounds()
    });

    L.control.layers(
        //{ "Map": osm },
        { "MSOA": topoMsoaLayer, "LSOA": topoLsoaLayer }
    ).addTo(map);
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
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer) {
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
            });
            document.getElementById("employment").addEventListener('change', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer) {
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
            });
            document.getElementById("education").addEventListener('change', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer){
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
            });
            document.getElementById("health").addEventListener('change', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer){
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
            });
            document.getElementById("crime").addEventListener('change', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer){
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
            });
            document.getElementById("housing").addEventListener('change', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer){
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
            });
            document.getElementById("environment").addEventListener('change', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer){
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
            });
            sliderListenersAdded = true;
            hasInitializedStyle = true;
        }
        else if (props !== undefined) {
            if (props.hasOwnProperty("LSOA11CD"))
                document.getElementById("idm").innerHTML = ": " + calculateIMD(props["LSOA11CD"]).toFixed(1) + "%";
            else {
                document.getElementById("idm").innerHTML = ": " + calculateMsoaIMD(props["MSOA11CD"]).toFixed(1) + "%";
            }
        }
    };

    info.addTo(map);


}());
