'use strict';

createBigorneau('asterplot_data.csv');



//Changer le texte en fonction de hiver et �t�
function supprTxtEte() {
	var i1 = document.getElementById('id1');
	var i2 = document.getElementById('id2');
	var i3 = document.getElementById('id3');
	i1.style.display = "none";
	i2.style.display = "none";
	i3.style.display = "none";
}

function supprTxtHiver() {
	var i1 = document.getElementById('hiver1');
	var i2 = document.getElementById('hiver2');
	var i3 = document.getElementById('hiver3');
	i1.style.display = "none";
	i2.style.display = "none";
	i3.style.display = "none";
}

function afficheTxtEte() {
	var i1 = document.getElementById('id1');
	var i2 = document.getElementById('id2');
	var i3 = document.getElementById('id3');
	i1.style.display="";
	i2.style.display="";
	i3.style.display="";
  document.getElementById('saison').innerHTML='ETE';
}

function afficheTxtHiver() {
	var i1 = document.getElementById('hiver1');
	if(i1.style.display=="none") {
		i1.style.display="";
	}
	var i2 = document.getElementById('hiver2');
	if(i2.style.display=="none") {
		i2.style.display="";
	}
	var i3 = document.getElementById('hiver3');
	i3.style.display="";
  document.getElementById('saison').innerHTML='HIVER';
}



//Supprime les �l�ments du diagramme
function deleteDiagram() {
  var diag = document.getElementById('diagramme');
  diag.parentNode.removeChild(diag);
  var tip = document.getElementById('tip');
  tip.parentNode.removeChild(tip);
}

function createGif(source){
	var gif = document.getElementById('gif');
	gif.src = source;
}

//Cr�e un bigorneau avec le fichier csv donn� en param�tre
function createBigorneau(source) {
  var width = 400,
      height = 400,
      radius = Math.min(width, height) / 2,
      innerRadius = 0.3 * radius;

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.width; });

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .attr('id','tip')
    .offset([0, 0])
    .html(function(d) {
      return d.data.label + ": <span style='z-index:10;color:orangered'>" + (Math.round(Math.pow(10,d.data.score/10)) +"%"/*Si on veut afficher le vrai score c'est ici */)  + "</span>";
    });

  var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(function (d) { 
      return (radius - innerRadius) * (d.data.score / 22.0) + innerRadius; 
    });

  var outlineArc = d3.svg.arc()
          .innerRadius(innerRadius)
          .outerRadius(radius);

  var svg = d3.select("#bigorneau").insert("svg",":first-child")
      .attr("width", width)
      .attr('id','diagramme')
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  svg.call(tip);


  d3.csv(source, function ete(error, data) {

    data.forEach(function(d) {
      d.id     =  d.id;
      d.order  = +d.order;
      d.color  =  d.color;
      d.weight = +d.weight;
      d.score  = +d.score;
      d.width  = +d.weight;
      d.label  =  d.label;
    });
    
    // for (var i = 0; i < data.score; i++) { console.log(data[i].id) }
    
    var path = svg.selectAll(".solidArc")
        .data(pie(data))
      .enter().append("path")
        .attr("fill", function(d) { return d.data.color; }) //applique les couleurs aux histos
        .attr("class", "solidArc")  //fait des arr�tes grises sur les barres de l'histo
        .attr("stroke", "white") 
        .attr("d", arc) //affiche les histos
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    var outerPath = svg.selectAll(".outlineArc") //contour du bigorneau
        .data(pie(data))
        .enter().append("path")
        .attr("fill", "none")
        .attr("d", outlineArc);  


    // calculate the weighted mean score
    var score = 
      data.reduce(function(a, b) {
        //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
        return a + (b.score * b.weight); 
      }, 0) / 
      data.reduce(function(a, b) { 
        return a + b.weight; 
      }, 0);



  });

}



/* fonction pour changer de diagramme (ne pas marche toujours pas) 
function changeImage(element){
	var x=element.getElementsByTagName("script").item(2);
	var v=x.getAttribute("src");
	if(v == "asterplot_js.js")
		v = "asterplot_hiver_js.js");
	else
		v = "asterplot_js.js");
	x.setAttribute("src", v);
}; */