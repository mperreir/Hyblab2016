(function() {
    "use strict";

    var INDICATORS = {
        crime: "Crime",
        income: "Income",
        employment: "Employment",
        education: "Education, Skills and Training",
        health: "Health Deprivation and Disability",
        housing: "Barriers to Housing and Services",
        environment: "Living Environment"
    };

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

    // calculate total agegroup for MSOA
    (function() {
        for (var MSOA11CD in MSOA) {
            MSOA[MSOA11CD]["ages"] = {};
            for (var group in AGES) {
                MSOA[MSOA11CD]["ages"][AGES[group]] = totalAges(AGES[group], MSOA[MSOA11CD]["LSOAs"]);
            }
        }
        
    }());

    function totalPeople(lsoa11cd) {
        var result = AGES
            .map(function(group) {
                return window.data[lsoa11cd]["ages"][AGES[group]];
            }).reduce(function(a, b) {
                return a + b;
            });
        return result;
    }

    // /*calculate the average age for the msoa*/
    // (function() {
    //     var LSOAs = MSOA[msoa11cd]["LSOAs"];        
    //     for (var MSOA11CD in MSOA) {
    //         var totalAges = 0;
    //         var totalPeople = 0;
    //         for (var LSOA11CD in LSOAs) {
    //             count++;
    //             totalPeople += totalPeople(LSOA11CD);
    //             totalAges += totalPeople * window.data[lsoa11cd]["ages.average"];
    //         }
    //         MSOA[MSOA11CD]["ages.average"] = totalAges / totalPeople;
    //     }
        
    // }());

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

    var calculateIMD = function(lsoa11cd) {
        //console.log(INDICATORS);
        var sum = 1;
        return LSOA_Limits["IMD"].max - Object.keys(INDICATORS).map(function(id) {
            //console.log(document.getElementById(id).checked);
            var val = document.getElementById(id).checked === true ? 2 : 1;
            sum += val;
            return window.data[lsoa11cd][id]["exp"] * val;
        }).map(function(val) {
            return val / sum;
        }).reduce(function(a, b) {
            return a + b;
        });
    };

    var calculateMsoaIMD = function(msoa11cd) {
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
                fillColor: getColor(1),
                weight: 2,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.7
            };
        } else {
            //console.log(calculateIMD);
            console.log('lsoa s2: ' + calculateIMD(feature.properties.LSOA11CD));
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
            //console.log('msoa style 1:' + getColor(MSOA[feature.properties.MSOA11CD]["IMD"]));
            msoaInitializedStyleCount++;
            return {
                fillColor: getColor(MSOA[feature.properties.MSOA11CD]["IMD"]),
                weight: 1,
                opacity: 0.5,
                color: 'black',
                fillOpacity: 0.7
            };
        } else {
            //console.log("msoa style 2:" + getColor(calculateMsoaIMD(feature.properties.MSOA11CD)));
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

        // info update
        //info.update(e.target.feature.properties);
        // barchart update
        var deciles = [];
        if (isLsoaLayer) {
            for (var indicator in INDICATORS) {
                deciles.push({
                    'indicator': indicator.toUpperCase(),
                    'decile': window.data[e.target.feature.properties["LSOA11CD"]][indicator]['decile']
                })
            }
        } else {
            for (var indicator in INDICATORS) {
                deciles.push({
                    'indicator': indicator.toUpperCase(),
                    'decile': MSOA[e.target.feature.properties["MSOA11CD"]][indicator]["decile"]
                })
            }
        }

        if (barchart._map != undefined) {
            // sanity check, in case that barchart not cleaned previously
            map.removeControl(barchart);
        }
        barchart.addTo(map);
        barchart.draw(deciles);

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
        // popChart.addTo(map);  
        // popChart.draw(ages);

        // add overlay (note: effect not good, disabled)
        // overlay.setAttribute('class', 'show');
    }

    function LsoaResetHighlight(e) {
        topoLsoaLayer.resetStyle(e.target);

        if (barchart._map != undefined) {
            map.removeControl(barchart);
        }
    }

    function MsoaResetHighlight(e) {
        topoMsoaLayer.resetStyle(e.target);

        if (barchart._map != undefined) {
            map.removeControl(barchart);
        }
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
        maxBounds: topoMsoaLayer.getBounds(),
        zoomControl: true
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
    /*
    L.control.layers(
        { "Map": osm },
        { "MSOA": topoMsoaLayer, "LSOA": topoLsoaLayer }
    ).addTo(map);*/
    //L.control.scale().addTo(map);

    // Create overlay for later use
    /*
    var overlay = (function() {
        var _div = L.DomUtil.create('div', '');
        _div.setAttribute('id', 'overlay');
        document.getElementById('map').appendChild(_div);
        return _div;
    }());*/

    var info = L.control();

    var sliderListenersAdded = false;
    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info');
        var info = L.control();
        this._div.innerHTML =
            '<h4>Index of Multiple Deprivation Score</h4>' +
            '<h4 id="idm"></h4> <br/>' +
            '<div class="buttons-set">' +
            '   <input id="income" type="checkbox"/>' +
            '   <input id="health" type="checkbox"/>' +
            '   <input id="education" type="checkbox"/>' +
            '   <input id="employment" type="checkbox"/>' +
            '   <input id="environment" type="checkbox"/>' +
            '   <input id="housing" type="checkbox"/>' +
            '   <input id="crime" type="checkbox"/>' +
            '   <div class="row">' +
            '   <img class="svg-btn" title="Income" id="income-svg" src="documents/mapIcons/income-active.svg"/>' +
            '   <img class="svg-btn" title="Health Deprivation and Disability" id="health-svg" src="documents/mapIcons/health-active.svg"/>' +
            '   <img class="svg-btn" title="Education, Skills and Training" id="education-svg" src="documents/mapIcons/education-active.svg"/>' +
            '   <img class="svg-btn" title="Employment" id="employment-svg" src="documents/mapIcons/employment-active.svg"/>' +
            '   </div><div class="row">' +
            '   <img class="svg-btn" title="Living Environment" id="environment-svg" src="documents/mapIcons/environment-active.svg"/>' +
            '   <img class="svg-btn" title="Barriers to Housing and Services" id="housing-svg" src="documents/mapIcons/housing-active.svg"/>' +
            '   <img class="svg-btn" title="Crime" id="crime-svg" src="documents/mapIcons/crime-active.svg"/>' +
            '   </div>' +
            '</div>';
            ''/* +
            '<div class="sliderset">' +
            '   <div class="row"></div><label>Income</label><i class="information" id="icon_income"></i><input id="income" type="range" min="0" max="1000" value="225" class="slider red"/><br/>' +
            '   <div class="row"></div><label>Employment</label><i class="information" id="icon_employment"></i><input id="employment" type="range" min="0" max="1000" value="225" class="slider orange"/><br/>' +
            '   <div class="row"></div><label>Education</label><i class="information" id="icon_education"></i><input id="education" type="range" min="0" max="1000" value="135" class="slider yellow"/><br/>' +
            '   <div class="row"></div><label>Health</label><i class="information" id="icon_health"></i><input id="health" type="range" min="0" max="1000" value="135" class="slider green"/><br/>' +
            '   <div class="row"></div><label>Crime</label><i class="information" id="icon_crime"></i><input id="crime" type="range" min="0" max="1000" value="93" class="slider blue"/><br/>' +
            '   <div class="row"></div><label>Housing</label><i class="information" id="icon_housing"></i><input id="housing" type="range" min="0" max="1000" value="93" class="slider indigo"/><br/>' +
            '   <div class="row"></div><label>Environment</label><i class="information" id="icon_environment"></i><input id="environment" type="range" min="0" max="1000" value="93" class="slider purple"/><br/>' +
            '</div>';*/
        this._div.addEventListener('mousemove', function(e) {
            e.stopPropagation();
        });

        return this._div;
    };

    info.configEventListener = function() {
        document.getElementById("income-svg").addEventListener('click', function(e) {
            topoLsoaLayer.eachLayer(function(layer) {
                topoLsoaLayer.resetStyle(layer);
            });
            topoMsoaLayer.eachLayer(function(layer) {
                topoMsoaLayer.resetStyle(layer);
            });
            var el = document.getElementById("income");
            if (el.checked === false) {
                e.target.setAttribute('src', "documents/mapIcons/income.svg");
                el.checked = true;
            }
            else {
                e.target.setAttribute('src', "documents/mapIcons/income-active.svg");
                el.checked = false;
            }
        });
        document.getElementById("employment-svg").addEventListener('click', function(e) {
            topoLsoaLayer.eachLayer(function(layer) {
                topoLsoaLayer.resetStyle(layer);
            });
            topoMsoaLayer.eachLayer(function(layer) {
                topoMsoaLayer.resetStyle(layer);
            });
            var el = document.getElementById("employment");
            if (el.checked === false) {
                e.target.setAttribute('src', "documents/mapIcons/employment.svg");
                el.checked = true;
            }
            else {
                e.target.setAttribute('src', "documents/mapIcons/employment-active.svg");
                el.checked = false;
            }
        });
        document.getElementById("education-svg").addEventListener('click', function(e) {
            topoLsoaLayer.eachLayer(function(layer) {
                topoLsoaLayer.resetStyle(layer);
            });
            topoMsoaLayer.eachLayer(function(layer) {
                topoMsoaLayer.resetStyle(layer);
            });
            var el = document.getElementById("education");
            if (el.checked === false) {
                e.target.setAttribute('src', "documents/mapIcons/education.svg");
                el.checked = true;
            }
            else {
                e.target.setAttribute('src', "documents/mapIcons/education-active.svg");
                el.checked = false;
            }
        });
        document.getElementById("health-svg").addEventListener('click', function(e) {
            topoLsoaLayer.eachLayer(function(layer) {
                topoLsoaLayer.resetStyle(layer);
            });
            topoMsoaLayer.eachLayer(function(layer) {
                topoMsoaLayer.resetStyle(layer);
            });
            var el = document.getElementById("health");
            if (el.checked === false) {
                e.target.setAttribute('src', "documents/mapIcons/health.svg");
                el.checked = true;
            }
            else {
                e.target.setAttribute('src', "documents/mapIcons/health-active.svg");
                el.checked = false;
            }
        });
        document.getElementById("crime-svg").addEventListener('click', function(e) {
            topoLsoaLayer.eachLayer(function(layer) {
                topoLsoaLayer.resetStyle(layer);
            });
            topoMsoaLayer.eachLayer(function(layer) {
                topoMsoaLayer.resetStyle(layer);
            });
            var el = document.getElementById("crime");
            if (el.checked === false) {
                e.target.setAttribute('src', "documents/mapIcons/crime.svg");
                el.checked = true;
            }
            else {
                e.target.setAttribute('src', "documents/mapIcons/crime-active.svg");
                el.checked = false;
            }
        });
        document.getElementById("housing-svg").addEventListener('click', function(e) {
            topoLsoaLayer.eachLayer(function(layer) {
                topoLsoaLayer.resetStyle(layer);
            });
            topoMsoaLayer.eachLayer(function(layer) {
                topoMsoaLayer.resetStyle(layer);
            });
            var el = document.getElementById("housing");
            if (el.checked === false) {
                e.target.setAttribute('src', "documents/mapIcons/housing.svg");
                el.checked = true;
            }
            else {
                e.target.setAttribute('src', "documents/mapIcons/housing-active.svg");
                el.checked = false;
            }
        });
        document.getElementById("environment-svg").addEventListener('click', function(e) {
            topoLsoaLayer.eachLayer(function(layer) {
                topoLsoaLayer.resetStyle(layer);
            });
            topoMsoaLayer.eachLayer(function(layer) {
                topoMsoaLayer.resetStyle(layer);
            });
            var el = document.getElementById("environment");
            if (el.checked === false) {
                e.target.setAttribute('src', "documents/mapIcons/environment.svg");
                el.checked = true;
            }
            else {
                e.target.setAttribute('src', "documents/mapIcons/environment-active.svg");
                el.checked = false;
            }
        });
    };

    info.update = function(props) {

        if (sliderListenersAdded == false) {
            document.getElementById("income-svg").addEventListener('click', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer) {
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
                var el = document.getElementById("income");
                if (el.checked === false) {
                    e.target.setAttribute('src', "documents/mapIcons/income.svg");
                    el.checked = true;
                }
                else {
                    e.target.setAttribute('src', "documents/mapIcons/income-active.svg");
                    el.checked = false;
                }
            });
            document.getElementById("employment-svg").addEventListener('click', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer) {
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
                var el = document.getElementById("employment");
                if (el.checked === false) {
                    e.target.setAttribute('src', "documents/mapIcons/employment.svg");
                    el.checked = true;
                }
                else {
                    e.target.setAttribute('src', "documents/mapIcons/employment-active.svg");
                    el.checked = false;
                }
            });
            document.getElementById("education-svg").addEventListener('click', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer) {
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
                var el = document.getElementById("education");
                if (el.checked === false) {
                    e.target.setAttribute('src', "documents/mapIcons/education.svg");
                    el.checked = true;
                }
                else {
                    e.target.setAttribute('src', "documents/mapIcons/education-active.svg");
                    el.checked = false;
                }
            });
            document.getElementById("health-svg").addEventListener('click', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer) {
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
                var el = document.getElementById("health");
                if (el.checked === false) {
                    e.target.setAttribute('src', "documents/mapIcons/health.svg");
                    el.checked = true;
                }
                else {
                    e.target.setAttribute('src', "documents/mapIcons/health-active.svg");
                    el.checked = false;
                }
            });
            document.getElementById("crime-svg").addEventListener('click', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer) {
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
                var el = document.getElementById("crime");
                if (el.checked === false) {
                    e.target.setAttribute('src', "documents/mapIcons/crime.svg");
                    el.checked = true;
                }
                else {
                    e.target.setAttribute('src', "documents/mapIcons/crime-active.svg");
                    el.checked = false;
                }
            });
            document.getElementById("housing-svg").addEventListener('click', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer) {
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
                var el = document.getElementById("housing");
                if (el.checked === false) {
                    e.target.setAttribute('src', "documents/mapIcons/housing.svg");
                    el.checked = true;
                }
                else {
                    e.target.setAttribute('src', "documents/mapIcons/housing-active.svg");
                    el.checked = false;
                }
            });
            document.getElementById("environment-svg").addEventListener('click', function(e) {
                info.update(props);
                topoLsoaLayer.eachLayer(function(layer) {
                    topoLsoaLayer.resetStyle(layer);
                });
                topoMsoaLayer.eachLayer(function(layer) {
                    topoMsoaLayer.resetStyle(layer);
                });
                var el = document.getElementById("environment");
                if (el.checked === false) {
                    e.target.setAttribute('src', "documents/mapIcons/environment.svg");
                    el.checked = true;
                }
                else {
                    e.target.setAttribute('src', "documents/mapIcons/environment-active.svg");
                    el.checked = false;
                }
            });
            sliderListenersAdded = true;
        } else if (props !== undefined) {
            if (props.hasOwnProperty("LSOA11CD"))
                //document.getElementById("idm").innerHTML = ": " + calculateIMD(props["LSOA11CD"]).toFixed(1) + "%";
                document.getElementById("idm").innerHTML = ": " +
                    parseInt(calculateIMD(props["LSOA11CD"]).toPrecision(1) / 10);
            else {
                console.log('info-listener');
                //document.getElementById("idm").innerHTML = ": " + calculateMsoaIMD(props["MSOA11CD"]).toFixed(1) + "%";
                document.getElementById("idm").innerHTML = ": " +
                    parseInt(calculateMsoaIMD(props["MSOA11CD"]).toPrecision(1) / 10);
            }
        }
    };

    info.addTo(map);
    info.configEventListener();
    //info.update();

    var searchbar = {};
    searchbar.create = function(map) {
        this._div = L.DomUtil.create('div', 'searchbar');
        this._div.innerHTML = '';

        this._input = L.DomUtil.create('input', '');
        this._input.setAttribute('type', 'text');
        this._input.setAttribute('id', 'searchbox');
        this._input.setAttribute('placeholder', 'TRY YOUR POSTCODE HERE :)');
        this._input.setAttribute('maxlength', 8);

        this._div.appendChild(this._input);

        document.getElementById('map').appendChild(this._div);

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
                        var deciles = [];
                        for (var indicator in INDICATORS) {
                            deciles.push({
                                'indicator': indicator.toUpperCase(),
                                'decile': window.data[lsoa11cd][indicator]['decile']
                            });
                            //console.log(window.data[lsoa11cd][indicator]['decile']);
                        }
                        if (barchart._map != undefined) {
                            map.removeControl(barchart);
                        }
                        barchart.addTo(map);
                        barchart.draw(deciles);
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
    searchbar.create(map);
    searchbar.configEventListener();


    var colorsOfIndicators = {
        'INCOME': '#805501',
        'HEALTH': '#029FDA',
        'EDUCATION': '#5203FF',
        'EMPLOYMENT': '#DAA643',
        'ENVIRONMENT': '#276880',
        'HOUSING': '#864FFF',
        'CRIME': '#FFDD9A'
    };

    var barchart = L.control({position : 'bottomright'});
    barchart.onAdd = function(map) {
        this._chartContainer = L.DomUtil.create('div', '');
        this._chartContainer.setAttribute('id', 'chartContainer');

        this._chartDescriptor = L.DomUtil.create('div', 'chartDescriptor');
        this._chartDescriptor.innerHTML = '<h4>Performance (10: Best, 0, Worst)</h4>';

        this._chartContainer.appendChild(this._chartDescriptor);

        return this._chartContainer;
    };
    // deciles
    barchart.draw = function(deciles) {

        var margin = {top: 10, right: 0, bottom: 55, left: 20},
            width = 320 - margin.left - margin.right,
            height = 250 - margin.top - margin.bottom;

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
            .ticks(10);

        var svg = d3.select("#chartContainer").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(['INCOME', 'HEALTH', 'EDUCATION', 'EMPLOYMENT', 'ENVIRONMENT', 'HOUSING', 'CRIME']);
        y.domain([0, 10]);

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('class', 'x-axis-label')
            .attr('dx', '0em')
            .attr('dy', '.8em')
            .attr('transform', 'rotate(-30)');

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        /* Label for y-axis
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -10)
        .attr("dy", "-1em")
        .style("text-anchor", "end")
        .text("Performance");*/

        svg.selectAll('.bar')
            .data(deciles)
            .enter().append('rect')
              .attr('class', function(d) { return 'bar'; })
            .attr('style', function(d) { return 'fill:' + colorsOfIndicators[d.indicator];})
            .attr('x', function(d) { return x(d.indicator); })
            .attr('width', x.rangeBand())
            .attr('y', height)
            .attr('height', '1')
            .transition()
            .attr('y', function(d) { return y(d.decile); })
            .attr('height', function(d) {return height - y(d.decile); });
    };

    var legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'legendContainer');
        this._div.innerHTML = '<div class="legend-label"><strong>most</strong> deprived</div>' +
            '<div class="legend"></div>' +
            '<div class="legend-label"><strong>least</strong> deprived</div>';
        return this._div;
    };
    legend.addTo(map);

    // Temporary fix, used util IMD calculation error is fixed
    topoMsoaLayer.eachLayer(function(layer) {
        topoMsoaLayer.resetStyle(layer);
    });
    topoLsoaLayer.eachLayer(function(layer) {
        topoLsoaLayer.resetStyle(layer);
    });
}());
