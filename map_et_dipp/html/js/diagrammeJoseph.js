"use strict"; 


var donneesJardinJoseph = {
    "printemps": [
        {nomProduit: "Racines", poids: 12850}, 
        {nomProduit: "Poids et Haricots", poids: 10934},
        {nomProduit: "Choux", poids: 8760},
        {nomProduit: "Epinards et Salades", poids: 19851},
        {nomProduit: "Courges", poids: 77400},
        {nomProduit: "Tomates", poids: 35314},
        {nomProduit: "Aromatiques", poids: 1260},
        {nomProduit: "Fruits", poids: 11600},
        {nomProduit: "Autres", poids: 2400}
    ],
    "ete": [
        {nomProduit: "Racines", poids: 7200}, 
        {nomProduit: "Poids et Haricots", poids: 5466},
        {nomProduit: "Choux", poids: 0},
        {nomProduit: "Epinards et Salades", poids: 6671},
        {nomProduit: "Courges", poids: 0},
        {nomProduit: "Tomates", poids: 88286},
        {nomProduit: "Aromatiques", poids: 1267},
        {nomProduit: "Fruits", poids: 2695},
        {nomProduit: "Autres", poids: 7265}
    ],
    "automne": [
        {nomProduit: "Racines", poids: 0}, 
        {nomProduit: "Poids et Haricots", poids: 0},
        {nomProduit: "Choux", poids: 2920},
        {nomProduit: "Epinards et Salades", poids: 0},
        {nomProduit: "Courges", poids: 0},
        {nomProduit: "Tomates", poids: 0},
        {nomProduit: "Aromatiques", poids: 1273},
        {nomProduit: "Fruits", poids: 15715},
        {nomProduit: "Autres", poids: 2300}
    ],
    "hiver": [
        {nomProduit: "Racines", poids: 0}, 
        {nomProduit: "Poids et Haricots", poids: 0},
        {nomProduit: "Choux", poids: 2920},
        {nomProduit: "Epinards et Salades", poids: 13233},
        {nomProduit: "Courges", poids: 0},
        {nomProduit: "Tomates", poids: 0},
        {nomProduit: "Aromatiques", poids: 0},
        {nomProduit: "Fruits", poids: 0},
        {nomProduit: "Autres", poids: 0}
    ], 
    "total": [
        {nomProduit: "Racines", poids: 20050}, 
        {nomProduit: "Poids et Haricots", poids: 16400},
        {nomProduit: "Choux", poids: 14600},
        {nomProduit: "Epinards et Salades", poids: 39755},
        {nomProduit: "Courges", poids: 77400},
        {nomProduit: "Tomates", poids: 123600},
        {nomProduit: "Aromatiques", poids: 3800},
        {nomProduit: "Fruits", poids: 30010},
        {nomProduit: "Autres", poids: 11965}
    ]
};

var infosJardinJoseph = {
    "Racines": { 
        idJauge: "jauge_racine",
        couleur: "#f7bd48",
        maximum: 20050,
        cheminImage: "./img/joseph/racines.svg"
    },
    "Poids et Haricots": { 
        idJauge: "jauge_haricots",
        couleur: "#c96d63", 
        maximum: 16400,
        cheminImage: "./img/joseph/haricots.svg"
    },
    "Choux": { 
        idJauge: "jauge_choux",
        couleur: "#b5ff9c",
        maximum: 14600,
        cheminImage: "./img/joseph/choux.svg"
    },
    "Epinards et Salades": { 
        idJauge: "jauge_salades",
        couleur: "#c9ff73",
        maximum: 39755,
        cheminImage: "./img/joseph/salades.svg"
    },
    "Courges": { 
        idJauge: "jauge_courges",
        couleur: "#d6ff38",
        maximum: 77400,
        cheminImage: "./img/joseph/courges.svg"
    },
    "Tomates": { 
        idJauge: "jauge_tomates",
        couleur: "#ee7268",
        maximum: 123600,
        cheminImage: "./img/joseph/tomates.svg"
    },
    "Aromatiques": { 
        idJauge: "jauge_aromatiques",
        couleur: "#aef86e",
        maximum: 3800,
        cheminImage: "./img/joseph/aromatiques.svg"
    },
    "Fruits": { 
        idJauge: "jauge_fruits",
        couleur: "#ffa87b",
        maximum: 30010,
        cheminImage: "./img/joseph/fruits.svg"
    },
    "Autres": { 
        idJauge: "jauge_autres",
        couleur: "#f7ff64",
        maximum: 11965,
        cheminImage: "./img/joseph/autres.svg"
    }
};


// utilisation de : http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6#index.html

var jauges = {};    // utilisé pour sauvegarder les Jauge Updater

var saisonActuelle = getSaisonActuelle();
var donneesActuelles = donneesJardinJoseph[saisonActuelle];
$("#radioJoseph_" + saisonActuelle).attr("checked", "");

$("#imageSaison").attr("src", "./img/joseph/background_" + saisonActuelle + ".png");

var total = [ calculerPoidsTotal(donneesActuelles) ];
d3.select("#totalJoseph").selectAll("p").data(total).enter().append("p").text(function(d) {
    return d;
});

donneesActuelles.forEach(function(element, index, tableau) {
    
    var infoElement = infosJardinJoseph[element.nomProduit];
    var idJauge = infoElement.idJauge;
    
    var baliseJauge = d3.select("#diagrammeJoseph").append("div").attr("class", "baliseJauge"); 
    var svgJauge = baliseJauge.append("svg").attr({
        "id": idJauge,
        "viewBox": "0 0 100 150",
        //"height": 150,
        //"width": 100
    });
    //"id", idJauge).attr("width", 100).attr("height", 150); svgJauge.attr("viewBox", "0, 0, 100 150");
    // <svg id="fillgauge6" width="19%" height="300" onclick="gauge6.update(NewValue());"></svg>
    
    
    var config = liquidFillGaugeDefaultSettings();
    config.minValue = 0;
    config.maxValue = (infoElement.maximum * 0.001).toFixed(1);
    config.circleThickness = 0.02;  // taille cercle extérieur
    config.circleFillGap = 0;       // espacement entre cercle extérieur et intérieur 
    config.textVertPosition = 1.6;  // positionner le texte au dessus de la gauge 
    config.circleColor = "#706f6f";
    config.textColor = "#999999";
    config.waveColor = infoElement.couleur;
    //config.waveTextColor = "#6DA398";
    config.waveAnimateTime = 5000;
    config.waveHeight = 0;
    config.waveAnimate = false;
    config.waveCount = 2;
    config.waveOffset = 0.25;
    config.textSize = 1.2;
    config.displayPercent = false;
    
    var poids = (element.poids * 0.001).toFixed(1);
    var jauge = loadLiquidFillGauge(idJauge, poids, config);
    jauges[idJauge] = jauge;
    
    // ajout du "kg" au dessus de la jauge
    svgJauge.select("g").append("text").attr("x", 50).attr("y", -6).attr("class", "liquidFillGaugeText").attr("text-anchor", "middle").style("fill", "#fdbe63").text("kg");   
    
    // remettre le groupe à la position (0, 0) (nécessaire car le texte de la jauge sortait de la zone)
    svgJauge.select("g").attr("transform", "translate(0, 50)");
    
    // ajout de l'image dans la jauge
    // <image x="200" y="200" width="100px" height="100px" xlink:href="myimage.png"> 
    //svgJauge.select("g").append("image").attr("x", 25).attr("y", 25).attr("xlink:href", infoElement.cheminImage).attr("width", 50).attr("height", 50);
    
    svgJauge.select("g").append("image").attr({
        "xlink:href": infoElement.cheminImage,
        "x": 0,
        "y": 0,
        "height": 50,
        "width": 50,
        "transform": "translate(25, 25)",
    });
    //"x", 0).attr("y", 25).attr("xlink:href", infoElement.cheminImage).attr("width", 50).attr("height", 50);
    
    
});


function updateDiagrammeJoseph(saison) {
    
    // mise à jour des colonnes de l'histogramme
    var donneesActuelles = donneesJardinJoseph[saison] || [];
    
    donneesActuelles.forEach(function(element, index, tableau) {
        var infosElement = infosJardinJoseph[element.nomProduit];
        var jauge = jauges[infosElement.idJauge];
        var poids = (element.poids * 0.001).toFixed(1);
        jauge.update(poids);
    });
    
    // mise à jour du total
    var total = [ calculerPoidsTotal(donneesActuelles) ];
    
    var balisesTotal = d3.select("#totalJoseph").selectAll("p").data(total).transition().duration(1000).tween("text", function() {
        var i = d3.interpolateRound(Number(this.textContent), total[0]);
        return function(t) {
            this.textContent = i(t);
        };
    });
    // tween permet d'animer la mise à jour d'un nombre
    
    // mise à jour de l'image de saison
    $("#imageSaison").attr("src", "./img/joseph/background_" + saison + ".png");
}



function calculerPoidsTotal(donnees) {
    var total = donnees.reduce(function(prec, elem, indice, tab) {
        return prec + elem.poids;
    }, 0);
    return (total * 0.001).toFixed(1);
}



function getSaisonActuelle() {
    var today = new Date();
    var mois = today.getMonth();
    var jour = today.getDay();
    
    // janvier: 0, fevrier: 1, ...
    if(mois >=2 && mois <= 5) { // entre mars et juin
        if(mois == 2 && jour < 20) return "hiver";
        else if(mois == 5 && jour > 20) return "ete";
        else return "printemps";
    }
    else if(mois >= 5 && mois <= 8) { // entre juin et septembre
        if(mois == 5 && jour < 21) return "printemps";
        else if(mois == 8 && jour > 22) return "automne";
        else return "ete";
    }
    else if(mois >= 8 && mois <= 11) { // entre septemps et decembre 
        if(mois == 8 && jour < 23) return "ete";
        else if(mois == 11 && jour > 20) return "hiver";
        else return "automne";
    }
    else return "hiver"
}




