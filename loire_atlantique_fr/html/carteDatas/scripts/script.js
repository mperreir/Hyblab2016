"use strict";

(function () {

    var pop_rsa_epci;

    document.addEventListener("onload", inlineSVG(), false);

    function inlineSVG() {
        var SVGMap = "./carteDatas/mapDatas/map.svg";
        var loadXML = new XMLHttpRequest();


        if (loadXML !== null) {
            loadXML.open("GET", SVGMap, true);
            loadXML.onreadystatechange = handler;
            loadXML.send();
        }

        function handler() {
            if (loadXML.readyState === 4 && loadXML.status === 200) {
                svgCarte.innerHTML = loadXML.responseText;

                // ------------- Carte : ------------------



                d3.json('./carteDatas/mapDatas/pop_rsa_epci.json', function (error, data) {
                    pop_rsa_epci = data;
                    $.each(data, function (key, val) {
                        var epci = document.getElementById(val.id);
                        if (val.population < 250) {
                            epci.style.fill = "#FDF39B";
                        } else if (val.population < 500) {
                            epci.style.fill = "#FFE775";
                        } else if (val.population < 1000) {
                            epci.style.fill = "#FFD94E";
                        } else if (val.population < 5000) {
                            epci.style.fill = "#FEC929";
                        } else {
                            epci.style.fill = "#FBBB10";
                        }

                        var nom = document.createElement('desc');
                        nom.id = "nom";
                        nom.textContent = val.nom;

                        epci.appendChild(nom);

                        var pop = document.createElement('desc');
                        pop.id = "population";
                        pop.textContent = val.population;

                        epci.appendChild(pop);

                    });
                });

                d3.json('./carteDatas/mapDatas/pop_rsa_communes.json', function (error, data) {
                    $.each(data, function (key, val) {
                        var com = document.getElementById(val.id);
                        if (val.population < 250) {
                            com.style.fill = "#FDF39B";
                        } else if (val.population < 500) {
                            com.style.fill = "#FFE775";
                        } else if (val.population < 1000) {
                            com.style.fill = "#FFD94E";
                        } else if (val.population < 5000) {
                            com.style.fill = "#FEC929";
                        } else {
                            com.style.fill = "#FBBB10";
                        }
                        var nom = document.createElement('desc');
                        nom.id = "nom";
                        nom.textContent = val.nom;

                        com.appendChild(nom);

                        var pop = document.createElement('desc');
                        pop.id = "population";
                        pop.textContent = val.population;

                        com.appendChild(pop);

                    });
                });

                var clickEpci = function clickEpci(event) {
                    var ref = this.id;
                    document.getElementById('epci').style.display = 'none';
                    document.getElementById('title').style.display = 'none';
                    document.getElementById('classement').style.display = 'none';

                    document.getElementById('svgArrow').style.display = 'block';
                   document.getElementById('titreCourbe').textContent = event.target.firstChild.textContent; 
                    document.getElementById('titreCourbe').style.display = 'block';
                    document.getElementById('courbe').style.display = 'block';
                    document.getElementById(ref + ".communes").style.display = 'block';

                    // ------------------ Courbes : ------------------

                    function getMaxObjectValue(this_array, element) {
                        var values = [];
                        for (var i = 0; i < this_array.length; i++) {
                            values.push(Math.ceil(parseFloat(this_array[i]["" + element])));
                        }
                        values.sort(function (a, b) {
                            return a - b
                        });
                        return values[values.length - 1];
                    }

                    function getMinObjectValue(this_array, element) {
                        var values = [];
                        for (var i = 0; i < this_array.length; i++) {
                            values.push(Math.floor(parseFloat(this_array[i]["" + element])));
                        }
                        values.sort(function (a, b) {
                            return a - b
                        });
                        return values[0];
                    }

                    $(document).ready(function () {
                        var data = [];
                        // this is our data array

                        d3.json('./carteDatas/mapDatas/curve_data.json', function (error, dataJson) {
                            $.each(dataJson, function (key, val) {
                                if (val.id === ref) {
                                    var values = [val.a2010, val.a2011, val.a2012, val.a2013, val.a2014];
                                    for (var i = 0; i < 5; i++) {
                                        var tmpObj = {};

                                        // this is a temporary data object
                                        tmpObj.date = new Date(2010 + i, 12, 31);

                                        // the data for this data object. Increment it from the starting date.
                                        tmpObj.DAU = values[i];
                                        data.push(tmpObj);
                                        // push the object into our data array

                                    }
                                }

                            });


                            var width = 320,
                                height = 320;
                            var margin = {
                                    top: 30,
                                    right: 10,
                                    bottom: 40,
                                    left: 100
                                },
                                width = width - margin.left - margin.right,
                                height = height - margin.top - margin.bottom;
                            // these are graph size settings

                            var minDate = new Date((data[0].date)),
                                maxDate = new Date(data[data.length - 1].date);
                            var minObjectValue = getMinObjectValue(data, 'DAU');
                            var maxObjectValue = getMaxObjectValue(data, 'DAU');
                            //create the graph object
                            var vis = d3.select("#courbe").append("svg")
                                .data(data)
                                .attr("id", "svgCourbe")
                                .attr("width", width + margin.left + margin.right)
                                .attr("height", height + margin.top + margin.bottom)
                                .append("g")
                                .attr("transform", "translate(" + margin.left / 2 + "," + margin.top / 2 + ")");
                            var y = d3.scale.linear().domain([minObjectValue - maxObjectValue / 20, maxObjectValue]).range([height, 0]);
                            var x = d3.time.scale().domain([d3.time.year(minDate), d3.time.year(maxDate)], 1).rangeRound([0, width]);

                            var xAxis = d3.svg.axis()
                                .scale(x)
                                .orient("bottom")
                                .ticks(5)
                                .outerTickSize([0]);



                            vis.append("g")
                                .attr("class", "axis")
                                .attr("transform", "translate(0," + height + ")")
                                .call(xAxis);

                            var yAxis = d3.svg.axis()
                                .scale(y)
                                .orient("left")
                                .ticks(5)
                                .outerTickSize([0]);

                            vis.append("g")
                                .attr("class", "axis")
                                .attr("transform", "translate(0," + 0 + ")")
                                .call(yAxis);
                            //add the axes labels
                            var line = d3.svg.line()
                                .x(function (d) {
                                    return x(d["date"]);
                                })
                                .y(function (d) {
                                    return y(d["DAU"]);
                                })
                            vis.append("svg:path")
                                .attr("d", line(data))
                                .style("stroke", function () {
                                    return "#FBBB10";
                                })
                                .style("fill", "none")
                                .style("stroke-width", "2.5");
                            var dataCirclesGroup = vis.append('svg:g');
                            var circles = dataCirclesGroup.selectAll('.data-point')
                                .data(data);
                            circles
                                .enter()
                                .append('svg:circle')
                                .attr('class', 'dot')
                                .attr('fill', function () {
                                    return "red";
                                })
                                .attr('cx', function (d) {
                                    return x(d["date"]);
                                })
                                .attr('cy', function (d) {
                                    return y(d["DAU"]);
                                })
                                .attr('r', function () {
                                    return 3;
                                })
                                .on("mouseover", overToolTipCourbe)
                                .on("mouseout", outToolTipCourbe);


                            d3.json('./carteDatas/mapDatas/curve_data.json', function (error, dataJson) {
                                $.each(dataJson, function (key, val) {


                                    if (document.getElementById(val.id + ".communes").style.display === "block") {

                                        var dotsData = [val.a2010, val.a2011, val.a2012, val.a2013, val.a2014];

                                        var i = 0;
                                    [].slice.call(svgCourbe.querySelectorAll('circle')).forEach(function (circle) {
                                            var text1 = document.createElement('text');
                                            text1.textContent = dotsData[i];
                                            text1.id = "nbAlloc";
                                            if (i > 0) {
                                                var text2 = document.createElement('text');
                                                text2.textContent = dotsData[i - 1] * 100 / dotsData[i];
                                                text2.id = "percentAlloc";
                                                circle.appendChild(text2);
                                            }
                                            circle.appendChild(text1);
                                            i = i + 1;
                                        });
                                    }
                                });

                            });

                        });
                    });
                };

                var clickRetour = function clickRetour(event) {


                    document.getElementById('epci').style.display = 'block';
                    document.getElementById('legend').style.display = 'block';
                    document.getElementById('title').style.display = 'block';

                    document.getElementById('classement').style.display = 'block';

                    document.getElementById('svgArrow').style.display = 'none';
                    document.getElementById('courbe').style.display = 'none';
                    document.getElementById('titreCourbe').style.display = 'none';

                [].slice.call(svgCarte.querySelectorAll('g#communes g'))
                        .forEach(function (path) {

                            path.style.display = 'none';

                        });
                    document.getElementById('courbe').removeChild(courbe.querySelectorAll("svg")[0]);

                };

                // ------------ Tooltips Functions : ------------

                var tooltipMap = new EETooltip({
                    'svgId': 'svgCarte',
                    'tooltipId': 'tooltipDivMap',
                    'headerText': "",
                    'footerText': "",
                    'keepInSVG': false
                });

                var overToolTipMap = function overToolTipMap(event) {
                    var datas = this.childNodes;
                    tooltipMap.updateTitle(
                        event.target.firstChild.textContent);
                    if(parseInt(datas.item(1).textContent, 10) > 5){
                    tooltipMap.addDataBlock("Nombre d'allocataires ", datas.item(1).textContent);
                    }
                    else{
                        tooltipMap.addDataBlock("Nombre d'allocataires ", "NC");
                    }
                    tooltipMap.show();

                };

                var outToolTipMap = function outToolTipMap(event) {

                    tooltipMap.hide();
                    tooltipMap.removeAllDataBlocks();

                };

                var tooltipCourbe = new EETooltip({
                    'svgId': 'dataVizMap',
                    'tooltipId': 'tooltipDivCourbe',
                    'headerText': "",
                    'footerText': "",
                    'keepInSVG': true
                });
                var overToolTipCourbe = function overToolTipCourbe(event) {

                    var data1 = this.querySelectorAll('text#nbAlloc')[0].textContent;

                    tooltipCourbe.addDataBlock("Nombre d'allocataires ", data1);
                    
                    if (this.querySelectorAll('text#percentAlloc')[0] !== undefined) {
                        var data2 = this.querySelectorAll('text#percentAlloc')[0].textContent.substring(0,4)+"%";
                        tooltipCourbe.addDataBlock("Evolution", data2);
                    }
                    tooltipCourbe.show();
                };



                var outToolTipCourbe = function outToolTipCourbe(event) {

                    tooltipCourbe.hide();
                    tooltipCourbe.removeAllDataBlocks();

                };

            [].slice.call(svgCarte.querySelectorAll('g#g36-2>path'))
                    .forEach(function (path) {
                        path.addEventListener('click', clickEpci);
                        path.addEventListener('mouseover', overToolTipMap);
                        path.addEventListener('mouseout', outToolTipMap);
                    });

            [].slice.call(svgCarte.querySelectorAll('g#communes path'))
                    .forEach(function (path) {
                        path.addEventListener('mouseover', overToolTipMap);
                        path.addEventListener('mouseout', outToolTipMap);
                    });

                document.getElementById('Capa_1')
                    .addEventListener('click', clickRetour);
            }
        }
    }

    // ------------ Legende : -----------------


    var svg = d3.select("#svgLegende").append("svg");

    var group = svg.append("g");
    var colors = ["#FDF39B", "#FFE775", "#FFD94E", "#FEC929", "#FBBB10"];
    for (var i = 0; i < 5; ++i) {
        group.append("rect")
            .attr("x", 68 * i)
            .attr("y", 0)
            .attr("width", 68)
            .attr("height", 30)
            .style("fill", colors[i]);
    }

    var overLegend, outLegend;
    (function () {
        var legend = null;

        function fillLegend(event) {
            var ref = this.style.fill;

        [].slice
                .call(svgCarte.querySelectorAll('g#g36-2>path'))
                .forEach(function (path) {
                    if (path.style.fill !== ref) {
                        path.style.fill = '#C4D1D9';
                        //path.style.opacity = 0;
                    }
                });
        };

        function clearLegend(event) {
        [].slice
                .call(svgCarte.querySelectorAll('g#g36-2>path'))
                .forEach(function (path) {
                    $.each(pop_rsa_epci, function (key, val) {
                        var epci = document.getElementById(val.id);
                        if (val.population < 250) {
                            epci.style.fill = "#FDF39B";
                        } else if (val.population < 500) {
                            epci.style.fill = "#FFE775";
                        } else if (val.population < 1000) {
                            epci.style.fill = "#FFD94E";
                        } else if (val.population < 5000) {
                            epci.style.fill = "#FEC929";
                        } else {
                            epci.style.fill = "#FBBB10";
                        }
                    });
                });
        };

        overLegend = function overLegend(event) {
            // If colored region is different than this
            // clear first
            if (this !== legend && legend !== null) {
                clearLegend.call(legend);
            }
            legend = this;
            fillLegend.call(legend);
        };

        outLegend = function outLegend(event) {
            // If colored region is different than this
            // do nothing
            if (this !== legend || legend === null /* shouldn't occur */ ) {
                return;
            }
            clearLegend.call(this);
            legend = null;
        };
    }());


            [].slice.call(svgLegende.querySelectorAll('svg>g>rect'))
        .forEach(function (rect) {

            rect.addEventListener('mouseout', outLegend);
            rect.addEventListener('mouseover', overLegend);
        });
    // ----------- Classement : ---------------

    var overClassement = function overClassement(event) {
        var ref = this.id;
        event.target.style.fontWeight = "bold";
                [].slice.call(svgCarte.querySelectorAll('g#g36-2>path'))
                
            .forEach(function (path) {
                if (path.id + ".cla" !== ref) {
                    path.style.fill = "#C4D1D9";
                }
            });
    };

    var outClassement = function outClassement(event) {
        event.target.style.fontWeight = "normal";
        $.each(pop_rsa_epci, function (key, val) {
            var epci = document.getElementById(val.id);
            if (val.population < 250) {
                epci.style.fill = "#FDF39B";
            } else if (val.population < 500) {
                epci.style.fill = "#FFE775";
            } else if (val.population < 1000) {
                epci.style.fill = "#FFD94E";
            } else if (val.population < 5000) {
                epci.style.fill = "#FEC929";
            } else {
                epci.style.fill = "#FBBB10";
            }

        });
    };

            [].slice.call(classement.querySelectorAll('tr'))
        .forEach(function (row) {
            if (row.id !== "titreTableRow" && row.id !== "titreCol") {
                row.addEventListener('mouseout', outClassement);
                row.addEventListener('mouseover', overClassement);
            }
        });


    /*
    d3.json('./carteDatas/mapDatas/curve_data.json', function (error, data) {
        $.each(data, function (key, val) {
            var lineData;
            if (document.getElementById(val.id + ".communes").style.display === "block") {
                lineData = [{
                    x: 2010,
                    y: val.2010
    }, {
                    x: 2011,
                    y: val.2011
    }, {
                    x: 2012,
                    y: val.2012
    }, {
                    x: 2013,
                    y: val.2013
    }, {
                    x: 2014,
                    y: val.2014
    }];
    */
}());
