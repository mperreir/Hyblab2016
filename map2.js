function defaultSetting() {
    return {
        radius: 250,
        width: "40%",
        height: "500px",
        backgroundColor: "#00BFFF",
        textColor: "#8A2908",
        circleColor: "#81DAF5",
        fontSize: "120px",
        valueCount: true,
        countTime: 1000,
        xPosition: 120,     //le x position de svg de population percentage
        yPosition: 50        //le y position de svg de population percentage

    };
}

function defaultSettingText() {
    return {
        width: "100%",
        height: "50%",
        widthText: 100,
        heightText: 50,
        widthContenu: 200,
        heightContenu: 400,
        fontSizeTitle: "30px",
        fontSizeContenu: "20px",
        fontColor: "#FFFFFF"

    }
}

function drawDescription(config, data) {
    var g = d3.select("#contenu").append("g")
        .attr("width", config.widthContenu)
        .attr("height", config.heightContenu);

    var text1 = g.append("svg:text")
        .attr("width", config.widthText)
        .attr("height", config.heightText)
        .attr("transform", "translate(50, 50)")
        .attr("font-size", config.fontSizeTitle)
        .style("color", config.fontColor)
        .text(data[0]);

    var text2 = g.append("svg:text")
        .attr("width", config.widthText)
        .attr("height", config.heightText)
        .attr("transform", "translate(50, 100)")
        .attr("font-size", config.fontSizeContenu)
        .style("color", config.fontColor)
        .text(data[1]);


}

function draw(config, data) {

    // console.log(data);

    var r = d3.scale.linear()
        .range([0, config.radius])
        .domain([0, 1]);

    var cx = d3.scale.linear()
        .range([0, config.radius])
        .domain([0, 1]);

    function cxPosition(d, i) {
        if(i == 0) 
            return cx(d.value);
        else {
            var x = cx(data[0].value);
            for(var n = 1; n <= i; n++) {
                x += .7 * Math.pow(-1, n-1)* (r(data[n-1].value) + r(data[n].value));
            }
            // console.log("x=" + x);
            return x;
        }
    }   

    var cy = d3.scale.linear()
        .range([0, config.radius])
        .domain([0, 1]);

    function cyPosition(d, i) {
        if(i == 0) 
            return cy(d.value);
        else {
            var y = cy(data[0].value);
            for(var n = 1; n <= i; n++) {
                y += .7 * (r(data[n-1].value) + r(data[n].value));
            }
            // console.log("y=" + y);
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

    var c = d3.scale.linear()
        .range([0, .41*config.radius])
        .domain([0, 1]);

    var d = d3.scale.linear()
        .range([0, 1.41*config.radius])
        .domain([0, 1]);

    var xText = d3.scale.linear()
        .range([0, .3*config.radius])
        .domain([0, 1]);

    var yText = d3.scale.linear()
        .range([0, 1.3*config.radius])
        .domain([0, 1]);

    var fontSize = d3.scale.linear()
        .range([0, config.fontSize])
        .domain([0, 1]);

    var svg = d3.select("#page3")
        .append("svg")
        .attr("id", "contenu")
        .attr("width", config.width)
        .attr("height", config.height)
        .style("background-color", config.backgroundColor);

    var g = svg.append("g")
        .attr("id", "groupGraph")
        .attr("width", 200)
        .attr("height", 500)
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
        .text(function(d, i) {
            // console.log("value=" + Math.ceil(d.value));
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
    "use strict";

    // Utility variable storing the max & min value of each indicator and IMD as well
    var LSOA_Limits = (function() {
        var result = {};
        result["IMD"] = {
            min: 100,
            max: 0
        };
        for (var indicator in INDICATORS) {
            result[indicator] = {
                min: 100,
                max: 0
            };
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

    function meanLSOAs(indicator, LSOAs, type) {
        var count = 0;
        var result = LSOAs
            .map(function(lsoa11cd) {
                count += 1;
                return window.data[lsoa11cd][indicator][type];
            }).reduce(function(a, b) {
                return a + b;
            }) / count;
        return result;
    }


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
    // Store indicators of MSOA
    (function() {
        for (var MSOA11CD in MSOA) {
            var count = 0;
            MSOA[MSOA11CD]["IMD"] = MSOA[MSOA11CD]["LSOAs"]
                .map(function(lsoa11cd) {
                    count += 1;
                    return window.data[lsoa11cd]["IMD"]["raw"];
                }).reduce(function(a, b) {
                    return a + b;
                }) / count;
            for (var indicator in INDICATORS) {
                MSOA[MSOA11CD][indicator] = {};
                MSOA[MSOA11CD][indicator]["raw"] = meanLSOAs(indicator, MSOA[MSOA11CD]["LSOAs"], "raw");
                MSOA[MSOA11CD][indicator]["decile"] = meanLSOAs(indicator, MSOA[MSOA11CD]["LSOAs"], "decile");
            }
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

    // // calculate total agegroup for MSOA
    // (function() {
    //     for (var MSOA11CD in MSOA) {
    //         MSOA[MSOA11CD]["ages"] = {};
    //         for (var group in AGES) {
    //             MSOA[MSOA11CD]["ages"][AGES[group]] = totalAges(AGES[group], MSOA[MSOA11CD]["LSOAs"]);
    //         }
    //     }
        
    // }());

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
                console.log(total);              
                MSOA[msoa11cd]["ages"][AGES[group]] = totalAges(GROUPS[group], MSOA[msoa11cd]["LSOAs"]) / total;
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
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
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
        score = (1- ((score - LSOA_Limits["IMD"].min) / (LSOA_Limits["IMD"].max - LSOA_Limits["IMD"].min))) / 3.0;
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
            .reduce(function(a, b) {
                return a + b;
            }) / LSOAs.length;
    };



    var lsoaInitializedStyleCount = 0;
    var msoaInitializedStyleCount = 0;
    var lsoaLayersNum = window.topo_lsoa.objects["E07000123"]["geometries"].length;
    var msoaLayersNum = Object.keys(MSOA).length;

    function LsoaStyle(feature) {
        if (lsoaInitializedStyleCount < lsoaLayersNum) {
            var d = window.data[feature.properties.LSOA11CD];
            lsoaInitializedStyleCount++;
            return {
                fillColor: getColor(d["IMD"]["raw"]),
                weight: 2,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.7
            };
        } else {
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
        if (msoaInitializedStyleCount < msoaLayersNum) {
            msoaInitializedStyleCount++;
            return {
                fillColor: getColor(MSOA[feature.properties.MSOA11CD]["IMD"]),
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.7
            };
        } else {
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

        // barchart.addTo(map);
        // barchart.draw(deciles);

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
        // console.log(ages);
        var page3 = document.getElementById("page3");
        var contenu = document.getElementById("contenu");
        if (page3 != undefined && contenu != undefined) {
            page3.removeChild(contenu);
        }
        // console.log(ages);
        draw(defaultSetting(), ages);

    }

    function LsoaResetHighlight(e) {
        topoLsoaLayer.resetStyle(e.target);
        var page3 = document.getElementById("page3");
        var contenu = document.getElementById("contenu");
        page3.removeChild(contenu);
    }

    function MsoaResetHighlight(e) {
        topoMsoaLayer.resetStyle(e.target);
        var page3 = document.getElementById("page3");
        var contenu = document.getElementById("contenu");
        page3.removeChild(contenu);
    }

    function updatePopup(e) {
        popup.setLatLng(e.latlng);
    }

    function OnLsoaClick(e) {
        // console.log(window.data[e.target.feature.properties.LSOA11CD]);
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
    var data = [{"name":"0-15", "value":0.38}, {"name":"16-25", "value":0.1}, {"name":"26-35", "value":0.16}, 
    {"name":"36-55", "value":0.26}, {"name":"56-90", "value":0.09}];

    // console.log(window.data);

    var description = ["THE AGE OF PRESTON", "description..................."];

    draw(defaultSetting(), data);

    // drawDescription(defaultSettingText(), description);

}());

    