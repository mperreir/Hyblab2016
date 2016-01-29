(function() {
    "use strict";

    // Utility variable storing the max & min value of each indicator and IMD as well
    var LSOA_Limits = (function() {
         var result = {};
         result["IMD"] = {min:100, max:0};
         for (var indicator in INDICATORS) {
             result[indicator] = {min:100, max:0};
         }
         for (var lsoa11cd in window.data) {
             for (var indicator in INDICATORS) {
                 if (result[indicator].max < window.data[lsoa11cd][indicator]["raw"]) {
                     result[indicator].max = window.data[lsoa11cd][indicator]["raw"];
                 }
                 if (result[indicator].min > window.data[lsoa11cd][indicator]["raw"]) {
                     result[indicator].min = window.data[lsoa11cd][indicator]["raw"];
                 }
             }
             if (result["IMD"].max < window.data[lsoa11cd]["IMD"]["raw"]) {
                 result["IMD"].max = window.data[lsoa11cd]["IMD"]["raw"];
             }
             if (result["IMD"].min > window.data[lsoa11cd]["IMD"]["raw"]) {
                 result["IMD"].min = window.data[lsoa11cd]["IMD"]["raw"];
             }
         }
        return result;
    }());

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
    /*
    var pushArray = function(oldArr) {
        var toPush = oldArr.concat.apply([], arguments);
        for (var i = 0, len = toPush.length; i < len; ++i) {
            this.push(toPush[i]);
        }
    };*/

    // Utility variable for storing MSOA's properties
    var MSOA = {};
    (function() {
        var g = topo_msoa.objects.E07000123.geometries;
        for (var i in g) {
            MSOA[g[i].properties["MSOA11CD"]] = { "LSOAs" : [], "PCD7s" : [] };
        }
    }());
    // Store info of mapping from MSOA to LSOAs
    (function() {
        for (var LSOA11CD in window.data) {
            var MSOA11CD = window.data[LSOA11CD]["MSOA11CD"];
            MSOA[MSOA11CD]["LSOAs"].push(LSOA11CD);
            for (var i in window.data[LSOA11CD]["PCD7s"]) {
                MSOA[MSOA11CD]["PCD7s"].push(window.data[LSOA11CD]["PCD7s"][i]);
            }
        }
        for (var MSOA11CD in MSOA) {
            MSOA[MSOA11CD]["PCD7s"].sort();
        }
    }());
    // Store indicators of MSOA
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
        score = (1 - ((score - LSOA_Limits["IMD"].min) / (LSOA_Limits["IMD"].max - LSOA_Limits["IMD"].min))) / 6.0;
        var rgb = HSVtoRGB(score, 1, 1);
        return RGBtoHEX(rgb.r, rgb.g, rgb.b);
    }

    window.calculateIMD = function(lsoa11cd) {
        var sum = 1;
        return Object.keys(INDICATORS).map(function(id) {
            var val = Number.parseFloat(document.getElementById(id).value);
            sum += val;
            return window.data[lsoa11cd][id]["exp"] * val;
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
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.7
            };
        }
        else {
            return {
                fillColor: getColor(calculateIMD(feature.properties.LSOA11CD)),
                weight: 2,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.7
            };
        }
    }

    function MsoaStyle(feature) {
        if (!hasInitializedStyle) {
            return {
                fillColor: getColor(MSOA[feature.properties.MSOA11CD]["IMD"]),
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.7
            };
        }
        else {
            return {
                fillColor: getColor(calculateMsoaIMD(feature.properties.MSOA11CD)),
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.7
            };
        }
    }

    function getMsoaPopupContent(CD, NM) {
        var arr = MSOA[CD]["PCD7s"];
        return '<h4>' + NM + '</h4><div>( '
            + arr[0] + ' - '
            + arr[arr.length-1] + ' )</div>';
    }

    function getLsoaPopupContent(CD, NM) {
        var arr = window.data[CD]["PCD7s"];
        return '<h4>' + NM + '</h4><div>( '
        + arr[0] + ' - '
        + arr[arr.length-1] + ' )</div>';
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#fff',
            opacity: 1
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

        info.update(e.target.feature.properties);

        var CD;
        var NM;
        if (e.target.feature.properties.hasOwnProperty("LSOA11NM")) {
            CD = e.target.feature.properties["LSOA11CD"];
            NM = e.target.feature.properties["LSOA11NM"];
            popup
                .setLatLng(e.latlng)
                .setContent(getLsoaPopupContent(CD, NM))
                .openOn(map);
        }
        else {
            CD = e.target.feature.properties["MSOA11CD"];
            NM = e.target.feature.properties["MSOA11NM"];
            popup
                .setLatLng(e.latlng)
                .setContent(getMsoaPopupContent(CD, NM))
                .openOn(map);
        }


    }

    function LsoaResetHighlight(e) {
        topoLsoaLayer.resetStyle(e.target);
        //map.closePopup(popup);
    }

    function MsoaResetHighlight(e) {
        topoMsoaLayer.resetStyle(e.target);
        //map.closePopup(popup);
    }

    function updatePopup(e) {
        popup.setLatLng(e.latlng);
    }

    function OnLsoaClick(e) {
        console.log(window.data[e.target.feature.properties.LSOA11CD]);
        map.fitBounds(e.target.getBounds());
    }

    function OnMsoaClick(e) {
        map.fitBounds(e.target.getBounds());
    }

    function LsoaOnEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: LsoaResetHighlight,
            mousemove: updatePopup,
            click: OnLsoaClick
        });
    }

    function MsoaOnEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: MsoaResetHighlight,
            mousemove: updatePopup,
            click: OnMsoaClick
        });
    }

    var popup = L.popup({
        closeButton: false
    });

    var topoLsoaLayer = new L.TopoJSON(window.topo_lsoa, {
        style: LsoaStyle,
        onEachFeature: LsoaOnEachFeature
    });

    var topoMsoaLayer = new L.TopoJSON(window.topo_msoa, {
        style: MsoaStyle,
        onEachFeature: MsoaOnEachFeature
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
        layers: [osm, topoMsoaLayer], // Only Add default layers here
        minZoom: 11,
        maxZoom: 16,
        maxBounds: topoMsoaLayer.getBounds()
    });

    map.on('zoomend', function(e) {
        if (map.getZoom() >= 13) {
            map.addLayer(topoLsoaLayer);
            map.removeLayer(topoMsoaLayer);
        }
        else {
            map.addLayer(topoMsoaLayer);
            map.removeLayer(topoLsoaLayer);
        }
    });

    topoLsoaLayer.on('mouseout', function(e) {
        map.closePopup(popup);
    });

    topoMsoaLayer.on('mouseout', function(e) {
        map.closePopup(popup);
    });
    /*
    L.control.layers(
        { "Map": osm },
        { "MSOA": topoMsoaLayer, "LSOA": topoLsoaLayer }
    ).addTo(map);*/
    L.control.scale().addTo(map);

    var info = L.control();

    var sliderListenersAdded = false;
    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info');
        var info = L.control();
        this._div.innerHTML =
            '<h4>Index of Multiple Deprivation Score</h4>' +
            '<h4 id="idm"></h4> <br/>' +
            '<h5>How much does each of the following matters to you ?</h5>' +
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

        //console.log(this._div);
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

    var searchbar = L.control();
    searchbar.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'searchbar');
        this._div.innerHTML = '';

        this._input = L.DomUtil.create('input', '');
        this._input.setAttribute('type', 'text');
        this._input.setAttribute('id', 'searchbox');
        this._input.setAttribute('placeholder', 'TRY YOUR POSTCODE HERE :)');
        this._input.setAttribute('maxlength', 8);

        this._div.appendChild(this._input);

        return this._div;
    };
    searchbar.configEventListener = function() {
        var input = document.getElementById("searchbox");
        var keypressEventListener = function(e) {
            var pcd = input.value.replace(/ /g, '');
            if (pcd.length === 6) {
                pcd = pcd.toUpperCase();
                var lsoa11cd = PCDtoLSOA11CD(pcd);
                for (var layer in topoLsoaLayer["_layers"]) {
                    if (topoLsoaLayer["_layers"][layer].feature.properties.LSOA11CD === lsoa11cd) {
                        map.fitBounds(topoLsoaLayer["_layers"][layer].getBounds());
                        popup
                            .setLatLng(topoLsoaLayer["_layers"][layer].getBounds().getCenter())
                            .setContent(topoLsoaLayer["_layers"][layer].feature.properties.LSOA11NM)
                            .openOn(map);
                        topoLsoaLayer["_layers"][layer].setStyle({
                            weight: 5,
                            color: '#fff',
                            opacity: 1
                        });
                    }
                }
            }
        };
        input.addEventListener('focus', function(focusEvent) {
            input.addEventListener('keyup', keypressEventListener);
        });
        input.addEventListener('focusout', function(focusoutEvent) {
            input.removeEventListener('keyup', keypressEventListener);
        });
    };
    searchbar.addTo(map);
    searchbar.configEventListener();

    var barchart = L.control({position : 'bottomright'});
    barchart.onAdd = function(map) {
        this._chartContainer = L.DomUtil.create('div','');
        this._chartContainer.setAttribute('id', 'chartContainer');
        //this._chartContainer.innerHTML = '<h1>adsf</h1>';
        return this._chartContainer;
    };
    barchart.addTo(map);
    // deciles
    barchart.draw = function(deciles) {
        var margin = {top: 20, right: 0, bottom: 20, left: 0},
            width = 400 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

        var svg = d3.select("#chartContainer").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(['INCOME', 'HEALTH', 'EDUCATION', 'EMPLOYMENT', 'ENVIRONMENT', 'HOUSING', 'CRIME']);
        y.domain(d3.range(10));

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Performance");

        console.log(deciles);

        svg.selectAll('.bar')
            .data(deciles)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', function(d) { console.log(d);return x(d.indicator); })
            .attr('width', x.rangeBand())
            .attr('y', function(d) { return y(d.decile); })
            .attr('height', function(d) { return height - y(d.decile); })
    };
    barchart.draw(
        [   {'indicator':'INCOME',decile:5},
            {'indicator':'HEALTH',decile:5},
            {'indicator':'EDUCATION',decile:5},
            {'indicator':'EMPLOYMENT',decile:5},
            {'indicator':'ENVIRONMENT',decile:5},
            {'indicator':'HOUSING',decile:5},
            {'indicator':'CRIME',decile:5}]
    );

    /*
    the chart of the population
    */
    //var popChart = L.control({position : 'bottomright'});


}());
