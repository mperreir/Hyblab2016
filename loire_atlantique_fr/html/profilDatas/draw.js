'use strict';

$(document).ready(function () {

    var width = 960,
        height = document.documentElement.clientHeight,
        radius = 316,
        innerRadius = (316 / 420) * radius;

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .attr("font-size", 55)
        .offset([0, 0])
        .direction(function (d) {
            if ((d.startAngle > (2 * Math.PI / 3) && d.startAngle < (4 * Math.PI / 3)) || (d.endAngle < (10 * Math.PI / 12) && d.endAngle > Math.PI)) {
                return "s";
            } else {
                return "n";
            }
        })
        .html(function (d) {
            if (d.data.affiche) {
                return d.data.name + " : <span style='color:white'>" + d.data.value + "%" + "</span>";
            } else {
                return "";
            }
        });




    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(function (d) {
            return (radius - innerRadius) * (d.data.value / 100.0) * 1.2 + innerRadius;
        });

    /*
    var outlineArc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);*/

    /*
    var enterAntiClockwise = {
      startAngle: Math.PI*2,
      endAngle: Math.PI * 2,
        data : {value : 10}
    };*/
    var svg = d3.select("#section1").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + 316 + "," + 350 + ")");

    svg.call(tip);



    // Store the displayed angles in _current.
    // Then, interpolate from _current to the new angles.
    // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
        var i = d3.interpolateObject(this._current, a);
        //k = d3.interpolate(this._current.value, a.data.value);
        //this._current.value = k(0);
        return function (t) {
            //return arc.innerRadius(200).outerRadius(k(t))(i(t));
            return arc(i(t));
        };
    }


    var button = d3.select("svg")
        .append("g")
        .attr("transform", "translate(" + 316 + "," + 350 + ")")
        .attr("id", "buttons");


    /*pour le burger_menu
    var menu_button_span1 = d3.select("body").append("span")
                             .attr("class","menuTrigger")
                             .attr("id","hamburger-one")
                             .on("click",hide);


    var menu_button_span2 = menu_button_span1.append("span")
                                             .attr("class","mainLine")



    	d3.selectAll('.menuTrigger').on("click",function(){
    		this.toggleClass('menuToggle');});

    */






    d3.json('profilDatas/data.json', function (error, data) {

        var menu_button = button.append("image")
            .attr("class", "menu")
            .attr("xlink:href", "profilDatas/icone/menu.gif")
            .attr("x", -15)
            .attr("y", 180)
            .attr("height", 30)
            .attr("width", 30)
            .attr("visibility", "hidden")
            .on("click", hide);





        var buttons = button.selectAll(".picto_menu")
            .data(data)
            .enter()
            .append("image")
            .attr("class", "picto_menu")
            .attr("xlink:href", function (d) {
                return d.adresse_picto;
            })
            .attr("x", function (d) {
                return d.pos_button_x;
            })
            .attr("y", function (d) {
                return d.pos_button_y;
            })
            .attr("height", 50)
            .attr("width", 50)
            .attr("visibility", "visible")
            .on("click", change)
            .on("mouseover", function (d) {
                d3.select(this).attr("xlink:href", function (d) {
                    return d.adresse_picto_hoover;
                })
            })
            .on("mouseout", function (d) {
                d3.select(this).attr("xlink:href", function (d) {
                    return d.adresse_picto;
                })
            });

        var buttonRects = button.selectAll(".rect_menu")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "rect_menu")
            .attr("x", function (d) {
                return d.pos_button_x;
            })
            .attr("y", function (d) {
                return d.pos_button_y + 60;
            })
            .attr("height", 15)
            .attr("width", 60)
            .attr("fill", "black")
            .attr("visibility", "visible")

        var buttonText = button.selectAll(".text_menu")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "text_menu")
            .text(function (d) {
                return d.texte_button;
            })
            .attr("x", function (d) {
                return d.pos_button_x + 30;
            })
            .attr("y", function (d) {
                return d.pos_button_y + 70;
            })
            .attr("fill", "white")
            .attr("visibility", "visible")
            .attr("text-anchor", "middle")
            .on("click", change);



        var path = svg.selectAll(".solidArc")
            .data(pie(data[0].data))
            .enter()
            .append("path")
            .attr("fill", function (d) {
                return d.data.color;
            })
            .attr("class", "solidArc")
            .attr("stroke", "none")
            .attr("d", arc)

        .each(function (d) {
                this._current = { //<-- give the entering slices a starting point
                    startAngle: d.startAngle, //<-- have them "grow" from nothing
                    endAngle: d.startAngle,
                    value: 0
                };
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .on("mouseenter", function (d) {
                d3.select(this)
                    .attr("stroke", "white")
                    .transition()
                    .duration(1000)
                    .attr("stroke-width", 6);
            })
            .on("mouseleave", function (d) {
                d3.select(this).transition()
                    .attr("stroke", "none");
            }).transition().duration(1000).attrTween("d", arcTween);


        var data_stock = data[0];

        var hidden = false;

        function hide() {
            hidden = !hidden;
            var visibility;
            if (hidden) {
                visibility = "hidden";
                d3.selectAll(".contenu_element").attr("visibility", "visible");

                change(data_stock, 0);
            } else {
                visibility = "visible";
                d3.selectAll(".contenu_element").attr("visibility", "hidden");

                //console.log(data[0]);
                change(data[0], -1);
            }

            d3.selectAll(".picto_menu").attr("visibility", visibility);
            d3.selectAll(".text_menu").attr("visibility", visibility);
            d3.selectAll(".rect_menu").attr("visibility", visibility);
        }

        function hide2() {
            var icone;
            var visibility;
            if (!hidden) {
                visibility = "hidden";
                d3.selectAll(".contenu_element").attr("visibility", "visible");
            } else {
                visibility = "visible";
                d3.selectAll(".contenu_element").attr("visibility", "hidden");

            }

            change(data_stock, 1);
            d3.selectAll(".picto_menu").attr("visibility", visibility);
            d3.selectAll(".text_menu").attr("visibility", visibility);
            d3.selectAll(".rect_menu").attr("visibility", visibility);

        }



        /*
          var outerPath = svg.selectAll(".outlineArc")
              .data(pie(data))
            .enter().append("path")
              .attr("fill", "none")
              .attr("stroke", "gray")
              .attr("class", "outlineArc")
              .attr("d", outlineArc);  */


        var contenu = svg.append("g")
            .attr("class", "contenu")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle") // text-align: right
            .style("font-size", "20px")


        data[0].data_centrale.forEach(
            function (elem) {
                changeDataCentrale(elem);
            });

        function changeDataCentrale(elem) {


            if (elem.type == "image") {
                contenu.append("image")
                    .attr("class", "contenu_element")
                    .attr("xlink:href", elem.image + "?a=" + Math.random())
                    .attr("x", elem.pos_x)
                    .attr("y", elem.pos_y)
                    .attr("height", elem.height)
                    .attr("width", elem.width);
            } else {
                var textContenu = contenu.append("text")
                    .attr("class", "contenu_element")
                    .attr("x", elem.pos_x)
                    .attr("y", elem.pos_y)
                    .attr("height", elem.height)
                    .attr("width", elem.width)



                elem.text.forEach(
                    function (elem) {
                        var texts = textContenu.append("tspan").attr("y", elem.y).attr("x", elem.x).attr("text-anchor", "start");
                        if (elem.type == "bold") {
                            texts.attr("font-weight", "bold");
                        }
                        texts.text(elem.text);

                    });
            }
        }


        var titre = svg.append("svg:text")
            .attr("class", "name_graphe")
            .attr("dy", ".20em")
            .attr("y", -300)
            .attr("x", -radius)
            .attr("text-anchor", "start") // text-align: right
            .style("font", "open sans")
            .style("font-weight", "bold")
            .style("font-size", "24px")
            .text(data[0].name);


        var commentaire = svg.append("svg:foreignObject")
            .attr('width', 300)
            .attr('height', height)
            .attr("x", 340)
            .attr("y", -200);

        commentaire.append('xhtml:p')
            .attr("class", "title_statement")
            .style("font-size", "50px")
            .style("font-weight", "bold")
            .style("background-color", "#e0e8eb")
            .text(data[0].titre_commentaire);

        commentaire.append('xhtml:p')
            .attr("class", "statement")
            .style("font-size", "30px")
            .text(data[0].commentaire);




        function change(d, i) {

            menu_button.attr("visibility", "visible");

            if (i != -1) {

                data_stock = d;

                d3.selectAll(".picto_menu").attr("visibility", "hidden");
                d3.selectAll(".text_menu").attr("visibility", "hidden");
                d3.selectAll(".rect_menu").attr("visibility", "hidden");

                hidden = true;
            }





            var path = d3.select("svg").select("g").selectAll(".solidArc");
            var pathData = path.data(pie(d.data)).attr("fill", function (d) {
                return d.data.color;
            });


            var pathToAdd = pathData.enter()
                .append("path")
                .attr("fill", function (d) {
                    return d.data.color;
                })
                .attr("class", "solidArc")
                .attr("stroke", "none")
                .each(function (d) {
                    this._current = { //<-- give the entering slices a starting point
                        startAngle: d.startAngle, //<-- have them "grow" from nothing
                        endAngle: d.startAngle,
                        value: 0
                    };
                })
                //.attr("d", arc(enterAntiClockwise))
                .attr("d", arc)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);





            var pathToDelete = pathData.exit();


            pathToDelete.transition().duration(750).attr("d", arcTween).remove(); //slowly delete arcs

            pathData.transition().duration(1000).attrTween("d", arcTween); // redraw the arcs

            pathData.on("mouseenter", function (d) {
                    d3.select(this)
                        .attr("stroke", "white")
                        .transition()
                        .duration(1000)
                        .attr("stroke-width", 6);
                })
                .on("mouseleave", function (d) {
                    d3.select(this).transition()
                        .attr("stroke", "none");
                });


            d3.selectAll(".contenu_element").remove();

            d.data_centrale.forEach(
                function (elem) {
                    changeDataCentrale(elem);
                });

            titre.text(d.name);

            d3.selectAll(".statement").remove();
            d3.selectAll(".title_statement").remove();

            commentaire.append('xhtml:p')
                .attr("class", "title_statement")
                .style("font-size", "34px")
                .style("font-weight", "bold")
                .style("word-wrap", "break-word")
                .text(d.titre_commentaire);

            commentaire.append('xhtml:p')
                .attr("class", "statement")
                .style("font-size", "15px")
                .style("word-wrap", "break-word")
                .text(d.commentaire);


        }

        function deleteTween(a) {
            var i = d3.interpolate(this._current, {
                startAngle: Math.PI * 2,
                endAngle: Math.PI * 2,
                value: 0
            });
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }



    });
});
