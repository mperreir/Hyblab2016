"use strict";

console.log("test");

var width = 480,
height = 400,
radius = Math.min(width, height) / 1.9,
spacing = .08,
opacity = .2,
posMax = .7,
colText = "hsl(300,100%,50%)";


var color = d3.scale.linear()
.range(["hsl(0,0%,100%)", "hsl(195,100%,50%)"])
.interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });


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
    d.text = Math.round(d.val1);
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
//.attr("transform", function(d) { console.log(this); })
.attr("dy", ".35em")
//.attr("dy", function(d,i) { console.log(this); })
.attr("dx", ".75em")
.style("text-anchor", "start")
.append("textPath")
.attr("startOffset", "50%")
.attr("class", "arc-text")
.attr("fill", colText)
.attr("xlink:href", function(d, i) { return "#arc-center-" + i; });


//affichage des année
field.append("text")
//inversion du text
.attr("dy", "0.35em")
.attr("dx", "0.75em")
.attr("fill", colText)
.style("text-anchor", "start")
.attr("y", function (d) { return (d.index + 0.05) * (radius + spacing); })
.attr("class", "year-text");

/*

//affichage des images
//vers eolienne
field.append("svg:image")
.attr('x',-width/2)
.attr('y',-height/2)
.attr('width', 20)
.attr('height', 24)
.attr("xlink:href","../resources/images/test.png")
.on("click", function(d) {
    console.log("click");
    toE();
	} );
	
//vers photovol
field.append("svg:image")
.attr('x',width/2 - 20)
.attr('y',-height/2)
.attr('width', 20)
.attr('height', 24)
.attr("xlink:href","../resources/images/test.png")
.on("click", function(d) {
	console.log("click");
	zero();
	} );
*/


tick();

//d3.select(self.frameElement).style("height", height + "px");

function zero() {
	//mise à zéro des valeurs
	for (var i = 0; i < 5; i++) {
		field.data()[i].previousValue = field.data()[i].value;
		field.data()[i].value = 0;
    }
	//transition
	if (!document.hidden) field
		.transition()
		.duration(500)
        .each(fieldTransition)
}

function toE() {
	console.log("toE");
	//calcule de la nouvelle valeur
	for (var i = 0; i < 5; i++) {
		field.data()[i].previousValue = field.data()[i].value;
		field.data()[i].value = field.data()[i].value + 0.2;
    }
	//transition
    if (!document.hidden) field
		.transition()
		.duration(500)
		.delay(function(d,i) { return (4-i)*500; })
        .each(fieldTransition)
}

function toP() {
    console.log("toP");
	//calcule de la nouvelle valeur
	for (var i = 0; i < 5; i++) {
		field.data()[i].previousValue = field.data()[i].value;
		field.data()[i].value = field.data()[i].value + 0.2;
    }
	//transition
    if (!document.hidden) field
		.transition()
		.duration(500)
		.delay(function(d,i) { return (4-i)*500; })
        .each(fieldTransition)
}

function toB() {
    
}


function tick() {
	console.log(field.data());
    if (!document.hidden) field
        //.each(function(d) { this._value = d.value; })
        //.data(fields)
        //.each(function(d) { d.previousValue = this._value; })
        //.transition()
        //.ease("elastic")
        //.duration(500)
        .each(fieldTransition)
        //fonction de callback
        //.each("end", function(d) {console.log("test");});
    
    //setTimeout(tick, 1000 - Date.now() % 1000);
}

function fieldTransition() {
    var field = d3.select(this).transition();
    
    //data
    field.select(".arc-body")
    .attrTween("d", arcTween(arcBody))
    .style("fill-opacity", function(d) { return d.opacity;})
    .style("fill", function(d) { return color(d.value);});
    
    field.select(".arc-center")
    .attrTween("d", arcTween(arcCenter));
    
    
    //text sur les data
    field.select(".arc-text")
    .text(function(d) {return d.text; });
    
    
    //affichage des années
    field.select(".year-text")
    .style("fill-opacity", function(d) { return d.opacity;})
    .text(function(d) {return d.year; });
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
//valeurs entre 0-1
function fields() {
    return [
            {index: .5, text: "", value: 0.9, previousValue: 0.9, opacity: 1, year: "2014", val1: "8000", val2: "7000", val3: "6000"},
            {index: .4, text: "", value: 0.5, previousValue: 0.5, opacity: 1, year: "2012", val1: "7000", val2: "6000", val3: "5000"},
            {index: .3, text: "", value: 0.4, previousValue: 0.4, opacity: 1, year: "2010", val1: "6000", val2: "5000", val3: "4000"},
            {index: .2, text: "", value: 0.3, previousValue: 0.3, opacity: 1, year: "2008", val1: "5000", val2: "4000", val3: "3000"},
            {index: .1, text: "", value: 0.2, previousValue: 0.2, opacity: 1, year: "2004", val1: "4000", val2: "3000", val3: "2000"}
            ];
}