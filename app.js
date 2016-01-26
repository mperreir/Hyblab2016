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
    var NUMBER_LSOA = 32844;
    var INDICATORS = {
        crime: "Crime",
        income: "Income",
        employment: "Employment",
        education: "Education, Skills and Training",
        health: "Health Deprivation and Disability",
        barriers: "Barriers to Housing and Services",
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
            var val = document.getElementById(id).value;
            sum += val;
            return window.data[lsoa11cd][id] * val;
        }).map(function(val) {
            return val / sum;
        }).reduce(function(a, b) {
            return a + b;
        });
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

    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info');
        var info = L.control();
        this._div.innerHTML =
            '<h4>Index of Multiple Deprivation Score:</h4>' +
            '<div id="idm"></div>' +
            '<div class="sliderset">' +
            '   <div class="row"></div><label>Income</label><input id="income" type="range" min="0" max="100" value="22.5" class="slider red"/><br/>' +
            '   <div class="row"></div><label>Enployment</label><input id="enployment" type="range" min="0" max="100" value="22.5" class="slider orange"/><br/>' +
            '   <div class="row"></div><label>Education</label><input id="education" type="range" min="0" max="100" value="13.5" class="slider yellow"/><br/>' +
            '   <div class="row"></div><label>Health</label><input id="health" type="range" min="0" max="100" value="13.5" class="slider green"/><br/>' +
            '   <div class="row"></div><label>Crime</label><input id="crime" type="range" min="0" max="100" value="9.3" class="slider blue"/><br/>' +
            '   <div class="row"></div><label>Housing</label><input id="housing" type="range" min="0" max="100" value="9.3" class="slider indigo"/><br/>' +
            '   <div class="row"></div><label>Environment</label><input id="environment" type="range" min="0" max="100" value="9.3" class="slider purple"/><br/>' +
            '</div>'
        this.update();
        this._div.addEventListener('mousemove', function(e) {
            e.stopPropagation();
        });
        return this._div;
    };

    info.update = function(props) {
        if (props !== undefined) {
            var income = window.data[props["LSOA11CD"]]["income"];
            var enployment = window.data[props["LSOA11CD"]]["enpolyment"];
            var education = window.data[props["LSOA11CD"]]["education"];
            var health = window.data[props["LSOA11CD"]]["health"];
            var crime = window.data[props["LSOA11CD"]]["crime"];
            var housing = window.data[props["LSOA11CD"]]["housing"];
            var environment = window.data[props["LSOA11CD"]]["environment"];
            document.getElementById("idm").innerHTML =
                    income * document.getElementById("income").value +
                    enployment * document.getElementById("income").value +
                    education * document.getElementById("education").value +
                    health * document.getElementById("health").value +
                    crime * document.getElementById("crime").value +
                    housing * document.getElementById("housing").value +
                    environment * document.getElementById("environment").value;
        }
    }

    info.addTo(map);
}())
