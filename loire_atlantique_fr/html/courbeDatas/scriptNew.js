"use strict";
$(document).ready(function () {
    // Set the dimensions of the canvas / graph
    var margin = {
            top: 50,
            right: 70,
            bottom: 50,
            left: 70
        },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%Y").parse;
    //parseDate = Number;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y0 = d3.scale.linear().range([height, 0]);
    var y2 = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom").ticks(5);

    var yAxisLeft = d3.svg.axis()
        .scale(y0)
        .orient("left").ticks(5);

    var yAxisRight = d3.svg.axis()
        .scale(y2)
        .orient("right").ticks(5);

    // Define the line
    var line0 = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y0(d.nbDemandeur);
        });
    var line1 = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y0(d.nbBenefRSA);
        });
    var line2 = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y0(d.nbBenefLongueDuree);
        });
    var line3 = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y2(d.depenses);
        });

    // Adds the svg canvas
    var svg = d3.select("#graph1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    d3.csv("./courbeDatas/dataT2.csv", function (error, data) {
        data.forEach(function (d) {
            d.date = parseDate(d.date);
            //d.nbBenefRSA = d.nbBenefRSA;
            //d.nbBenefLongueDuree = d.nbBenefLongueDuree;
            //d.depenses = d.depenses;
            //d.nbDemandeur = Number(d.nbDemandeur);
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        y0.domain([0, 80]); //d3.max(data, function(d) { return d.nbBenefRSA; })]);
        y2.domain([90, 150]); //d3.max(data, function(d) {return d.depenses; })]);


        // Add the valueline path.
        var path = svg.append("path")
            .datum(data)
            .attr("class", "line1")
            .attr("d", line1);

        // Variable to Hold Total Length
        var totalLength = path.node().getTotalLength();

        // Set Properties of Dash Array and Dash Offset and initiate Transition
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition() // Call Transition Method
            .duration(2000) // Set Duration timing (ms)
            .ease("linear") // Set Easing option
            .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'datapoint1')
            .attr('cx', function (d) {
                return x(d.date);
            })
            .attr('cy', function (d) {
                return y0(d.nbBenefRSA);
            })
            .attr('r', 3)
            .attr('fill', 'white')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', '2');
        //.on('mouseover', tip.show)
        //.on('mouseout', tip.hide);

        var active = false;
        var active2 = true;

        var path = svg.append("path")
            .datum(data)
            .attr("class", "line0")
            .attr("d", line0);

        // Variable to Hold Total Length
        var totalLength = path.node().getTotalLength();

        // Set Properties of Dash Array and Dash Offset and initiate Transition
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition() // Call Transition Method
            .duration(2000) // Set Duration timing (ms)
            .ease("linear") // Set Easing option
            .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'datapoint0')
            .attr('cx', function (d) {
                return x(d.date);
            })
            .attr('cy', function (d) {
                return y0(d.nbDemandeur);
            })
            .attr('r', 3)
            .attr('fill', 'white')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', '2');
        //.on('mouseover', tip.show)
        //.on('mouseout', tip.hide);

        // Add the valueline path. n°2
        var path = svg.append("path")
            .datum(data)
            .attr("class", "line2")
            .attr("d", line2);

        // Variable to Hold Total Length
        var totalLength = path.node().getTotalLength();

        // Set Properties of Dash Array and Dash Offset and initiate Transition
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition() // Call Transition Method
            .duration(2000) // Set Duration timing (ms)
            .ease("linear") // Set Easing option
            .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'datapoint2')
            .attr('cx', function (d) {
                return x(d.date);
            })
            .attr('cy', function (d) {
                return y0(d.nbBenefLongueDuree);
            })
            .attr('r', 3)
            .attr('fill', 'white')
            .attr('stroke', 'red')
            .attr('stroke-width', '2');
        //.on('mouseover', tip.show)
        //.on('mouseout', tip.hide);


        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (height + 10) + ")")
            .call(xAxis);

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "left")
            .text("nombre de personnes en Loire Atlantique (en milliers)")
            .attr("transform", "translate(0)");

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0, 10)")
            .call(yAxisLeft);

        d3.select("#buttonNb").on("click", function () {

            if (active) {
                d3.select(".line3").remove();
                d3.selectAll(".datapoint3").remove();
                d3.select("#blueAxis").remove();

                var path = svg.append("path")
                    .datum(data)
                    .attr("class", "line2")
                    .attr("d", line2);

                // Variable to Hold Total Length
                var totalLength = path.node().getTotalLength();

                // Set Properties of Dash Array and Dash Offset and initiate Transition
                path
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition() // Call Transition Method
                    .duration(2000) // Set Duration timing (ms)
                    .ease("linear") // Set Easing option
                    .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition

                svg.selectAll(".dot")
                    .data(data)
                    .enter().append("circle")
                    .attr('class', 'datapoint2')
                    .attr('cx', function (d) {
                        return x(d.date);
                    })
                    .attr('cy', function (d) {
                        return y0(d.nbBenefLongueDuree);
                    })
                    .attr('r', 3)
                    .attr('fill', 'white')
                    .attr('stroke', 'red')
                    .attr('stroke-width', '2');
                //.on('mouseover', tip.show)
                //.on('mouseout', tip.hide);

                active = false;
                active2 = true;
                $('#disable').on('click', function () {
                    $('.buttonex').disable();
                });
                $('#enable').on('click', function () {
                    $('.buttonEmp').enable();
                });
            }
        });

        d3.select("#buttonEmp").on("click", function () {

            if (active2) {
                d3.select(".line2").remove();
                d3.selectAll(".datapoint2").remove();

                svg.append("g")
                    .attr("class", "y axis")
                    .attr("id", "blueAxis")
                    .attr("transform", "translate(" + width + " , 10 )")
                    .call(yAxisRight);


                var path = svg.append("path")
                    .datum(data)
                    .attr("class", "line3")
                    .attr("d", line3);

                // Variable to Hold Total Length
                var totalLength = path.node().getTotalLength();

                // Set Properties of Dash Array and Dash Offset and initiate Transition
                path
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition() // Call Transition Method
                    .duration(2000) // Set Duration timing (ms)
                    .ease("linear") // Set Easing option
                    .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition

                svg.selectAll(".dot")
                    .data(data)
                    .enter().append("circle")
                    .attr('class', 'datapoint3')
                    .attr('cx', function (d) {
                        return x(d.date);
                    })
                    .attr('cy', function (d) {
                        return y2(d.depenses);
                    })
                    .attr('r', 3)
                    .attr('fill', 'white')
                    .attr('stroke', 'blue')
                    .attr('stroke-width', '2');
                //.on('mouseover', tip.show)
                //.on('mouseout', tip.hide);

                active2 = false;
                active = true;
                $('#disable').on('click', function () {
                    $('.buttonEmp').disable();
                });
                
            }
        });



    });
});
