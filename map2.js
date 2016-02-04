function defaultSetting() {
    return {
        radius: .1 * window.screen.width,
        radiusMin: .01 * window.screen.width,
        radiusMedium: .06 * window.screen.width,
        width: "40%",
        height: "100%",
        widthG: "80%",
        heightG: "100%",
        backgroundColor: "#00BFFF",
        textColor: "#8A2908",
        circleColor: "#81DAF5",
        fontSize: "120px",
        valueCount: true,
        countTime: 1000,
        xPosition: .1 * window.screen.width,     //le x position de svg de population percentage
        yPosition: .1 * window.screen.height        //le y position de svg de population percentage

    };
}

function getMaxPercentage(data) {

}

function draw(config, data) {

    var r = d3.scale.linear()
        .range([config.radiusMin, config.radiusMedium, config.radius])
        .domain([0, 0.2, 0.9]);

    var cx = d3.scale.linear()
        .range([config.radiusMin, config.radiusMedium, config.radius])
        .domain([0, 0.2, 0.9]);

    function cxPosition(d, i) {
        if(i == 0) 
            return cx(d.value);
        else {
            var x = cx(data[0].value);
            for(var n = 1; n <= i; n++) {
                x += .7 * Math.pow(-1, n-1)* (r(data[n-1].value) + r(data[n].value));
            }
            return x;
        }
    }   

    var cy = d3.scale.linear()
        .range([config.radiusMin, config.radiusMedium, config.radius])
        .domain([0, 0.2, 0.9]);

    function cyPosition(d, i) {
        if(i == 0) 
            return cy(d.value);
        else {
            var y = cy(data[0].value);
            for(var n = 1; n <= i; n++) {
                y += .7 * (r(data[n-1].value) + r(data[n].value));
            }
            return y;
        }
        return cy(d.value);
    }
    function a(i) {
        var circle = document.getElementById("circle-0" + i);
        return circle.getAttribute("r")*1.41;       
    }


    function b(i) {
        var circle = document.getElementById("circle-0" + i);
        return circle.getAttribute("r");        
    }

    var xText = d3.scale.linear()
        .range([.3*config.radiusMin, .3*config.radiusMedium, .3*config.radius])
        .domain([0, 0.2, 0.9]);
        // .range([0, .3*config.radius])
        // .domain([0, 1]);

    var yText = d3.scale.linear()
        .range([1.3*config.radiusMin, 1.3*config.radiusMedium, 1.3*config.radius])
        .domain([0, 0.2, 0.9]);
        // .range([0, 1.3*config.radius])
        // .domain([0, 1]);

    var fontSize = d3.scale.linear()
        // .range([.1*config.fontSize, .6*config.fontSize, config.fontSize])
        // .domain([0, 0.2, 0.9]);
        .range([0, config.fontSize])
        .domain([0, 1]);


    var svg = d3.select("#page3").select(".fp-tableCell")
        .append("svg")
        .attr("id", "contenu")
        .attr("width", config.width)
        .attr("height", config.height)
        .style("background-color", config.backgroundColor);

    var g = svg.append("g")
        .attr("id", "groupGraph")
        .attr("width", config.widthG)
        .attr("height", config.heightG)
        .style("background-color", config.backgroundColor)
        .attr("transform", "translate(" + config.xPosition + "," + config.yPosition +")");


    var circle = g.selectAll(".circleBackground")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", function(d, i) {
            return "circle-0" + i;
        })
        .attr("cx", function(d, i) {
            return cxPosition(d, i);
        })
        .attr("cy", function(d, i) {
            return cyPosition(d, i);
        })
        .attr("r", function(d) {
            return r(d.value);
        })
        .style("fill", config.circleColor);

    var image = g.selectAll("image")
        .data(data)
        .enter().append("svg:image")
        .attr("transform", function(d, i) {
            var circle = document.getElementById("circle-0" + i);
            return "translate(" + circle.getAttribute("cx") + "," + circle.getAttribute("cy") + ")";
        })
        .attr("x", function(d, i) {
            return -a(i) / 2;
        })
        .attr("y", function(d, i) {
            return -b(i)*.8;
        })
        .attr("width", function(d, i) {
            return a(i);
        })
        .attr("height", function(d, i) {
            return b(i);
        })
        .attr("xlink:href", function(d, i) {
            if (i != 5)
                return "image/perso-0" + i + ".svg";
        });

    var text = g.selectAll("text")
        .data(data)
        .enter().append("svg:text")
        .attr("transform", function(d, i) {
            var circle = document.getElementById("circle-0" + i);
            return "translate(" + circle.getAttribute("cx") + "," + circle.getAttribute("cy") + ")";
        })
        .attr("x", function(d, i) {
            return -.2*a(i);
        })
        .attr("y", function(d, i) {
            return b(i) / 1.5;
        })
        .attr("width", function(d, i) {
            return a(i);
        })
        .attr("height", function(d, i) {
            return b(i);
        })
        .attr("font-size", function(d, i) {
            return fontSize(d.value);
        })
        .attr("text-align", "center")
        .text(function(d, i) {
            return Math.round(d.value * 100) + "%";
        })
        .attr("fill", config.textColor);

    if(config.valueCount) {
        g.selectAll("text")
            .data(data)
            .enter().append("svg:text")
            .transition()
            .duration(config.countTime)
            .tween("text", function(d, i) {
                var inter = d3.interpolate(this.textContent, d.value);
                return function(t) { this.textContent = Math.round(inter(t)) + "%"; }               
            });
    }

}



(function() {

    // Utility variable for storing MSOA's properties
    var MSOA = {};
    (function() {
        var g = topo_msoa.objects.E07000123.geometries;
        for (var i in g) {
            MSOA[g[i].properties["MSOA11CD"]] = {
                "LSOAs": [],
                "PCD7s": []
            };
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

    function totalAges(group, LSOAs) {
        var result = LSOAs
            .map(function(lsoa11cd) {
                return window.data[lsoa11cd]["ages"][group];
            }).reduce(function(a, b) {
                return a + b;
            });
        return result;
    }

    // calculate total number of people for MSOA

    function totalPeople(msoa11cd) {
        var result = 0;
        for(var lsoa11cd in MSOA[msoa11cd]["LSOAs"]) {
            for (var group in GROUPS) {
                result += window.data[MSOA[msoa11cd]["LSOAs"][lsoa11cd]]["ages"][GROUPS[group]];
            }
        }
        return result;
    }

    (function() {
        for (var msoa11cd in MSOA) {
            MSOA[msoa11cd]["ages"] = {};
            var total = totalPeople(msoa11cd);  //total number of the total msoa11cd
            for (var group in GROUPS) {
                MSOA[msoa11cd]["ages"][AGES[group]] = totalAges(GROUPS[group], MSOA[msoa11cd]["LSOAs"]) / total;
            }
        }
        console.log(MSOA);

        
    }());

    var lsoaInitializedStyleCount = 0;
    var msoaInitializedStyleCount = 0;
    var lsoaLayersNum = window.topo_lsoa.objects["E07000123"]["geometries"].length;
    var msoaLayersNum = Object.keys(MSOA).length;

    function LsoaStyle(feature) {
            return {
                fillColor: "#088A08",
                weight: 2,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.7
            };
    }

    function MsoaStyle(feature) {
            return {
                fillColor: "#088A08",
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.7
            };
    }

    function getMsoaPopupContent(CD, NM) {
        var arr = MSOA[CD]["PCD7s"];
        return '<h4>' + NM + '</h4><div>( ' + arr[0] + ' - ' + arr[arr.length - 1] + ' )</div>';
    }

    function getLsoaPopupContent(CD, NM) {
        var arr = window.data[CD]["PCD7s"];
        return '<h4>' + NM + '</h4><div>( ' + arr[0] + ' - ' + arr[arr.length - 1] + ' )</div>';
    }

    function highlightFeature(e) {
        var isLsoaLayer = e.target.feature.properties.hasOwnProperty("LSOA11NM");

        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#fff',
            opacity: 1
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

        var CD;
        var NM;
        if (isLsoaLayer) {
            CD = e.target.feature.properties["LSOA11CD"];
            NM = e.target.feature.properties["LSOA11NM"];
            popup
                .setLatLng(e.latlng)
                .setContent(getLsoaPopupContent(CD, NM))
                .openOn(map);
        } else {
            CD = e.target.feature.properties["MSOA11CD"];
            NM = e.target.feature.properties["MSOA11NM"];
            popup
                .setLatLng(e.latlng)
                .setContent(getMsoaPopupContent(CD, NM))
                .openOn(map);
        }


        //update the data of the age group
        var ages = [];
        if (isLsoaLayer) {
            for (var group in AGES) {
                ages.push({
                    'name': AGES[group],
                    'value': window.data[CD]["ages"][AGES[group]]
                })
            }
        } else {
            for (var group in AGES) {
                ages.push({
                    'name': AGES[group],
                    'value': MSOA[CD]["ages"][AGES[group]]
                })
            } 
        }
        var contenu = d3.select("#contenu");
        if (contenu != undefined) {
            contenu.remove();
        };
        draw(defaultSetting(), ages);

    }

    function LsoaResetHighlight(e) {
        topoLsoaLayer.resetStyle(e.target);
    }

    function MsoaResetHighlight(e) {
        topoMsoaLayer.resetStyle(e.target);
    }

    function updatePopup(e) {
        popup.setLatLng(e.latlng);
    }

    function OnLsoaClick(e) {
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


    var map = L.map('map2', {
        center: [53.85, -2.7],
        zoom: 11,
        layers: [topoMsoaLayer],
        minZoom: 11,
        maxZoom: 16,
        maxBounds: topoMsoaLayer.getBounds(),
        zoomControl: false
    });


    map.on('zoomend', function(e) {
        if (map.getZoom() >= 13) {
            map.addLayer(topoLsoaLayer);
            map.removeLayer(topoMsoaLayer);
        } else {
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




    /*-------------------------------------------*/
    var data = [{"name":"0-15", "value":0.1}, {"name":"16-25", "value":0.1}, {"name":"26-35", "value":0.16}, 
    {"name":"36-55", "value":0.26}, {"name":"56-90", "value":0.09}];

    draw(defaultSetting(), data);

}());
