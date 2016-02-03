"use strict";

var width = 480,
height = 400,
radius = Math.min(width, height) / 1.9,
spacing = .08,
opacity = .2,
posMax = .7,
colText = "hsl(0,0%,0%)",
pos = 0,
deg = 0;


/*var color = d3.scale.linear()
.range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
.interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });
*/

//arc des data
var arcBody = d3.svg.arc()
.startAngle(Math.PI)
.endAngle(function(d) { return d.value * 2 * Math.PI + Math.PI; })
.innerRadius(function(d) { return d.index * radius; })
.outerRadius(function(d) { return (d.index + spacing) * radius; })
.cornerRadius(6);

var arcCenter = d3.svg.arc()
.startAngle(Math.PI)
.endAngle(function(d) { return d.value * 2 * Math.PI + Math.PI; })
.innerRadius(function(d) { return (d.index + spacing / 2) * radius; })
.outerRadius(function(d) { return (d.index + spacing / 2) * radius; });


var svg = d3.select("#svg_dataviz2")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var field = svg.selectAll("g")
.data(fields())
.enter().append("g");


//arc data
field.append("path")
.on("mouseover", function(d){
    d.text = Math.round(d["val"+pos]);
    for (var i = 0; i<field.data().length; i++){
    if(i != field.data().indexOf(d)){
    field.data()[i].opacity = opacity;
    }
    }
    tick();})
.on("mouseout", function(d){
    d.text = "";
    for (var i = 0; i<field.data().length; i++){
    field.data()[i].opacity = 1;
    }
    tick();})
.attr("class", "arc-body");

field.append("path")
.attr("id", function(d, i) { return "arc-center-" + i; })
.attr("class", "arc-center");


//text data
field.append("text")
.attr("dy", ".35em")
.attr("dx", ".75em")
.style("text-anchor", "start")
.append("textPath")
.attr("startOffset", "25%")
.attr("class", "arc-text")
.attr("fill", colText)
.attr("xlink:href", function(d, i) { return "#arc-center-" + i; });


//affichage des année
field.append("text")
.attr("dy", "0.35em")
.attr("dx", "0.75em")
.attr("fill", colText)
.style("text-anchor", "start")
.attr("y", function (d) { return (d.index + 0.05) * (radius + spacing); })
.attr("class", "year-text");

//affichage des data
field.append("text")
.attr("dy", "0.35em")
.attr("dx", "4.75em")
.attr("fill", colText)
.style("text-anchor", "start")
.attr("y", function (d) { return (d.index + 0.05) * (radius + spacing); })
.attr("class", "data-text");

//gestion des pales
var pales = d3.select("#data2_pale");


//gestion des boutons
var bouton_solaire = d3.select("#data2_solaire")
bouton_solaire
.on("click", function(d) {
    //on change le saviez_vous
    $(document.getElementById("saviez_vous_eolienne")).hide();
    $(document.getElementById("saviez_vous_biomasse")).hide();
    $(document.getElementById("saviez_vous_solaire")).show();
    //rotation de la pale
    var img = document.getElementById("data2_pale");
    if (pos!=1) {
        deg = pos==0 ? deg-120 : deg+120;
        $(img)
        .transition({
                    opacity: 1,
                    rotate: deg+'deg'
                    }, 500, 'linear',
                    function(){
                    //$(img).css({ rotate: '-120deg'})
                    })
        //remise a zéro des valeurs
        zero();
        //transition
        toS();
        //on eleve l'animation
        bouton_solaire.attr("class", "");
    }
    } );

var bouton_eolien = d3.select("#data2_eolien")
.on("click", function(d) {
    //on change le saviez_vous
    $(document.getElementById("saviez_vous_solaire")).hide();
    $(document.getElementById("saviez_vous_biomasse")).hide();
    $(document.getElementById("saviez_vous_eolienne")).show();
    //rotation de la pale
    var img = document.getElementById("data2_pale");
    if (pos!=0) {
        deg = pos==1 ? deg+120 : deg-120;
        $(img)
        .transition({
                    opacity: 1,
                    rotate: deg+'deg'
                    }, 500, 'linear',
                    function(){
                    //$(img).css({ rotate: '0deg'})
                    });
        //remise a zéro des valeurs
        zero();
        //transition
        toE();
    }
    } );

var bouton_biomasse = d3.select("#data2_biomasse")
.on("click", function(d) {
    //on change le saviez_vous
    $(document.getElementById("saviez_vous_solaire")).hide();
    $(document.getElementById("saviez_vous_eolienne")).hide();
    $(document.getElementById("saviez_vous_biomasse")).show();
    //rotation de la pale
    var img = document.getElementById("data2_pale");
    if (pos!=2) {
        deg = pos==0 ? deg+120 : deg-120;
        $(img)
        .transition({
                    opacity: 1,
                    rotate: deg+'deg'
                    }, 500, 'linear',
                    function(){
                    //$(img).css({ rotate: '120deg'})
                    });
        //remise a zéro des valeurs
        zero();
        //transition
        toB();
        //on eleve l'animation
        bouton_biomasse.attr("class", "");
    }
    } );

toE();


//d3.select(self.frameElement).style("height", height + "px");

function endall(transition, callback) {
    var n = 0;
    transition
    .each(function() { ++n; })
    .each("end", function() { if (!--n) callback.apply(this, arguments); });
}


function zero(callback) {
	//mise à zéro des valeurs
	for (var i = 0; i < 5; i++) {
		field.data()[i].previousValue = field.data()[i].value;
		field.data()[i].value = 0;
        field.data()[i].opacity = 1;
    }
	//transition
	if (!document.hidden) field
		.transition()
		.duration(500)
        .each(fieldTransition)
        //.call(endall, callback);
}

function toE() {
    pos = 0;
	//calcule de la nouvelle valeur
	for (var i = 0; i < 5; i++) {
		field.data()[i].previousValue = field.data()[i].value;
        field.data()[i].value = (field.data()[i].val0*posMax)/field.data()[0].val0;
        field.data()[i].opacity = 1;
    }
	//transition
    if (!document.hidden) field
		.transition()
		.duration(500)
		.delay(function(d,i) { return (4-i)*500; })
        .each(fieldTransition)
}

function toS() {
    console.log("toS");
    pos = 1;
	//calcule de la nouvelle valeur
	for (var i = 0; i < 5; i++) {
		field.data()[i].previousValue = field.data()[i].value;
		field.data()[i].value = (field.data()[i].val1*posMax)/field.data()[0].val1;
        console.log(field.data()[i].previousValue + '-' + field.data()[i].value);
        field.data()[i].opacity = 1;
    }
	//transition
    if (!document.hidden) field
		.transition()
		.duration(500)
		.delay(function(d,i) { return (4-i)*500; })
        .each(fieldTransition)
}

function toB() {
    pos = 2;
    //calcule de la nouvelle valeur
    for (var i = 0; i < 5; i++) {
        field.data()[i].previousValue = field.data()[i].value;
        field.data()[i].value = (field.data()[i].val2*posMax)/field.data()[0].val2;
        field.data()[i].opacity = 1;
    }
    //transition
    if (!document.hidden) field
        .transition()
        .duration(500)
        .delay(function(d,i) { return (4-i)*500; })
        .each(fieldTransition)
}


function tick() {
    if (!document.hidden) field
        .each(fieldTransition)
}

function fieldTransition() {
    
    var field = d3.select(this).transition();
    
    //for (var i =0; i < 5; i++){
    field.each(function(d) { console.log(d); });
    //}
    
    //data
    field.select(".arc-body")
    .attrTween("d", arcTween(arcBody))
    .style("fill-opacity", function(d) { return d.opacity;})
    .style("fill", function(d) {
           console.log("color : " + d.value * (1/(d["val"+pos]*posMax/d["val"+pos+"max"])));
           return d["col"+pos](d.value * (1/(d["val"+pos]*posMax/d["val"+pos+"max"])));});
    
    field.select(".arc-center")
    .attrTween("d", arcTween(arcCenter));
    
    
    //text sur les data
    /*field.select(".arc-text")
    .text(function(d) { return d.text=="" ? "" : d.text+"GWh";});
    console.log("truc");
    console.log(field.select(".arc-text"));*/
    
    
    //affichage des années
    field.select(".year-text")
    .style("fill-opacity", function(d) { return d.opacity;})
    .text(function(d) {return d.year; });
    
    //affichage data
    field.select(".data-text")
    .style("fill-opacity", function(d) { return d.opacity;})
    .style("fill", "hsla(356, 100%, 50%, 1)")
    .text(function(d) { return d.text=="" ? "" : d.text+"GWh";});
}

function arcTween(arc) {
    return function(d) {
        console.log( d.previousValue + "-" + d.value);
        var i = d3.interpolateNumber(d.previousValue, d.value);
        return function(t) {
			d.previousValue = d.value;
            d.value = i(t);
            return arc(d);
        };
    };
}

//model
function fields() {
    
    function color(c)
    {
        var col = d3.scale.linear()
        .range(["hsl(-180,60%,50%)", c])
        .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });
        return col;
    }
    
    
    return [
            {index: .5, text: "", value: 0, previousValue: 0, opacity: 1, year: "2014", val0: "1067", val1: "364", val2: "199", val0max: "1064", val1max: "364", val2max:  "199",col0: color("hsl(214,16%,80%)"), col1: color("hsl(6,78.8%,87.1%)"), col2: color("hsl(73,57.9%,81.4%)")},
            {index: .4, text: "", value: 0, previousValue: 0, opacity: 1, year: "2013", val0: "981", val1: "299", val2: "182", val0max: "1064", val1max: "364", val2max:  "199", col0: color("hsl(214,16%,63.1%)"), col1: color("hsl(6,78.9%,81.4%)"), col2: color("hsl(76,53.3%,76.5%)")},
            {index: .3, text: "", value: 0, previousValue: 0, opacity: 1, year: "2012", val0: "884", val1: "266", val2: "114", val0max: "1064", val1max: "364", val2max:  "199", col0: color("hsl(214,16.6%,48.4%)"), col1: color("hsl(6,73.4%,75.3%)"), col2: color("hsl(76,53.9%,70.2%)")},
            {index: .2, text: "", value: 0, previousValue: 0, opacity: 1, year: "2011", val0: "704", val1: "179", val2: "67", val0max: "1064", val1max: "364", val2max:  "199", col0: color("hsl(213,32.5%,32.5%)"), col1: color("hsl(6,78.5%,70.8%)"), col2: color("hsl(76,53.5%,63.7%)")},
            {index: .1, text: "", value: 0, previousValue: 0, opacity: 1, year: "2010", val0: "611", val1: "61", val2: "50", val0max: "1064", val1max: "364", val2max:  "199", col0: color("hsl(214,56.4%,21.6%)"), col1: color("hsl(6,78.3%,63.9%)"), col2: color("hsl(76,53.9%,57.5%)")}
            ];
}