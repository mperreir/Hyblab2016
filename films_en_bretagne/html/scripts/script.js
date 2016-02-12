"use srict";

// For one page full screen scrolling 
$(document).ready(function() {
    $('#fullpage').fullpage({
        sectionsColor: ['#19182D', '#373763', 'white', 'white', 'white', 'black', 'white'],
    });
    $.fn.fullpage.reBuild();
});


/*
    Affichage des maps
*/
/*global colorMap*/
/*global colorBackgroundMap*/

// 1ere map
$(function(){
    mapClickData('#french-map1',"avantRegion1","apresRegion1",".svg",".avantRegion1",".apresRegion1","label1",".label1","nom","svg","nombre","Moy_sp_DOC_region");
    colorBackgroundMap();
    /* Dataviz 1 : "Moy_sp_DOC_region"*/
    colorMap("Moy_sp_DOC_region","french-map1");
    $('.jvectormap-tip')[0].textContent = "Alsace";
});

// 2eme map
$(function(){
    mapClickData2('#french-map2');
    colorBackgroundMap();
    /*  Dataviz 2 : "Moy_auteur"*/
    colorMap("Moy_auteur","french-map2");
    bar_a_jour();
});

// 3eme map
$(function(){
    mapClickData3('#french-map3',"avantRegion3","apresRegion3",".svg3",".avantRegion3",".apresRegion3","label3",".label3","nom3","svg3","nombre3","Moy_aides_region");
    colorBackgroundMap();
    /*  Dataviz 3 : "Moy_aides_region"*/
    colorMap("Moy_aides_region","french-map3");
});


// Cliquer pour plus d'informations
function change($section){
      var im = document.createElement('img');
      im.src = "./Logos/guide-curseur.svg";
      $('.avantRegion').append(im);
      var p = document.createElement('p');
      p.textContent = "Cliquez pour plus d'informations";
      $('.apresRegion').append(p);
      $('.jvectormap-tip')[0].textContent = "Alsace";
};

// Fonction permettant d'afficher les données suite à un clic sur une région pour la dataviz1

/* Exemple de paramètres pour la fonction
 * idMap : "#french-map"
 * idRegAv : "avantRegion"
 * idRegAp : "apresRegion"
 * classRegAv : ".avantRegion"
 * classRegAp : ".apresRegion"
 * idLabel : "label1"
 * classLabel : ".label1"
 * classNom : "nom"
 * classSvg : "svg"
 * classNb : "nombre" 
 * data : "Moy_sp_DOC_region **/

function mapClickData(idMap,idRegAv,idRegAp,idSvg,classRegAv,classRegAp,idLabel,classLabel,classNom,classSvg,classNb,data){
    $(idMap).vectorMap({map: 'fr_regions_mill',
          onRegionClick: function(event,code){
            // Supression des noeuds fils 
            var div1 = document.getElementsByClassName(idRegAv)[0];
            div1.innerHTML="";
            var div2= document.getElementsByClassName(idRegAp)[0];
            div2.innerHTML="";
            
            //Ajout de la flèche de gauche ainsi que l'événement
            d3.select(classRegAp).append("img").attr("id","flechegauche").attr("src","Logos/fleche-data-gauche-fin.svg").attr("onclick",'clickFleche("gauche",1);').attr("onmouseover",'epaissir("gauche");').attr("onmouseout",'desepaissir("gauche");');
            
            // ajout du texte dans le div 
            d3.select(classRegAv).append("p").attr("class",idLabel);
            $(classLabel).html("Nombre de sociétés de production </br> de documentaires en");
            // ajout du nom de la région
            d3.select(classRegAv).append("p").attr("class",classNom);
            var nom = document.getElementsByClassName(classNom)[0]; 
            
            // ajout de la balise contenant la carte de la région dans le second div 
            d3.select(classRegAp).append("svg")
                .attr("class",classSvg)
                .attr("width",250)
                .attr("height",220)
                .attr("id",code);
            
            // ajout de la balise contenant le nombre
            d3.select(classRegAp).append("p").attr("class",classNb);
            var nb = document.getElementsByClassName(classNb)[0];
            
            //Ajout de la flèche de droite ainsi que l'événement
            d3.select(classRegAp).append("img").attr("id","flechedroite").attr("src","Logos/fleche-data-droite-fin.svg").attr("onclick",'clickFleche("droite",1);').attr("onmouseover",'epaissir("droite");').attr("onmouseout",'desepaissir("droite");');
            
            // Parcours du fichier JSON pour récupérer le chemin de la région et son nom
            var j = jQuery.getJSON("./JSON/regions.json",function(donnees){
              jQuery.each(donnees, function(){
                if( this.code == code){
                  d3.select(idSvg).append("path").attr("d",this.path).attr("fill","#A77548").attr("id","chemin");
                  nom.textContent = this.name;
                }
              });
            });
            // Parcours du second fichier JSON permettant de récupéré le nombre associé à la donnée
            var json = jQuery.getJSON("./JSON/hyblab.json", function(data1){
                jQuery.each(data1,function(){
                    if( this.Code == code){
                        nb.textContent = this[data];
                    }
                });
            });
          }
      })
}

// Fonction permettant d'afficher les données suite à un clic sur une région pour la dataviz3 

function mapClickData3(idMap,idRegAv,idRegAp,idSvg,classRegAv,classRegAp,idLabel,classLabel,classNom,classSvg,classNb,data){
    $(idMap).vectorMap({map: 'fr_regions_mill',
          onRegionClick: function(event,code){
            // Supression des noeuds fils 
            var div1 = document.getElementsByClassName(idRegAv)[0];
            div1.innerHTML="";
            var div2= document.getElementsByClassName(idRegAp)[0];
            div2.innerHTML="";
            
            //Ajout de la flèche de gauche ainsi que l'événement
            d3.select(classRegAp).append("img").attr("id","flechegauche").attr("src","Logos/fleche-data-gauche-fin.svg").attr("onclick",'clickFleche("gauche",3);').attr("onmouseover",'epaissir("gauche",3);').attr("onmouseout",'desepaissir("gauche");');
            
            // ajout du texte dans le div 
            d3.select(classRegAv).append("p").attr("class",idLabel);
            $(classLabel).html("Montant attribué par la Région </br> à la production de documentaires");
            // ajout du nom de la région
            d3.select(classRegAv).append("p").attr("class",classNom);
            var nom = document.getElementsByClassName(classNom)[0]; 
            
            // ajout de la balise de la région dans le second div 
            d3.select(classRegAp).append("svg")
                .attr("class",classSvg)
                .attr("width",250)
                .attr("height",220)
                .attr("id",code);
            // ajout de la balise contenant le nombre
            d3.select(classRegAp).append("p").attr("class",classNb);
            var nb = document.getElementsByClassName(classNb)[0];
            
            //Ajout de la flèche de droite ainsi que l'événement
            d3.select(classRegAp).append("img").attr("id","flechedroite").attr("src","Logos/fleche-data-droite-fin.svg").attr("onclick",'clickFleche("droite",3);').attr("onmouseover",'epaissir("droite",3);').attr("onmouseout",'desepaissir("droite");');
            
            // Parcours du fichier JSON pour récupérer le chemin de la région et son nom
            var j = jQuery.getJSON("./JSON/regions.json",function(donnees){
              jQuery.each(donnees, function(){
                if( this.code == code){
                  d3.select(idSvg).append("path").attr("d",this.path).attr("fill","#A77548").attr("id","chemin");
                  nom.textContent = this.name;
                }
              });
            });
            
            // Parcours du second fichier JSON permettant de récupéré le nombre associé à la donnée
            var json = jQuery.getJSON("./JSON/hyblab.json", function(data1){
                jQuery.each(data1,function(){
                    if( this.Code == code){
                        nb.textContent = this[data];
                    }
                });
            });
          }
      })
}

// Fonction permettant d'afficher les informations à la suite d'un clic sur une région
function mapClickData2(id){
    $(id).vectorMap({map: 'fr_regions_mill',
          onRegionClick: function(event,code){
             $('div').remove('#Region2');
             $('div').remove('#Region3');
             $('div').remove('#Region4');
             $('div').remove('#Province2');
             $('div').remove('#Province3');
             $('div').remove('#Province4');
             $('div').remove('#IDF2');
             $('div').remove('#IDF3');
             $('div').remove('#IDF4');
             document.getElementsByClassName('cliquer')[0].innerHTML="";
             document.getElementsByClassName("avantRegion2")[0].innerHTML="";
             bar_region(code);
             bar_a_jour();
            var json = jQuery.getJSON("./JSON/hyblab.json", function(data1){
                jQuery.each(data1,function(){
                    if( this.Code == code){
                       d3.select(".avantRegion2").append("p").attr("class","NomRegion");
                       var e = document.getElementsByClassName("NomRegion")[0];
                       e.textContent=this.Regions;
                    }
                });
            });
              
          }
      })
}



// Fonction permettant de changer d'informations grâce aux flèches droite et gauche

function clickFleche(sens,i){
    if(i == 1){ // Dans le cas de la dataviz1
        // Chaines de caractères pour les labels
        var dat1 = "Nombre de sociétés de production  de documentaires en";
        var dat2 = "Nombre de sociétés de production audiovisuelle  et cinématographique tous genres confondus en";
        var dat3 = "Part de la production documentaire par rapport  à la production tous genres confondus";
        
        var dat1br = "Nombre de sociétés de production </br> de documentaires en";
        var dat2br = "Nombre de sociétés de production audiovisuelle </br> et cinématographique tous genres confondus en";
        var dat3br = "Part de la production documentaire par rapport </br> à la production tous genres confondus";
        
        // Récupération des différentes balises
        var nombre = document.getElementsByClassName("nombre")[0];
        var label = document.getElementsByClassName("label1")[0];
    
        var svg = document.getElementsByClassName("svg")[0];
        
        // Récupération du code de la région sur laquelle l'utilisateur a cliqué
        var code = svg.getAttribute("id");
        
        // Parcours du fichier JSON pour récupérer les données
        var json = jQuery.getJSON("./JSON/hyblab.json", function(data){
            if(sens == "droite"){   // Dans le cas du clique sur une fléche droite
                if(label.textContent == dat1){  // On va à la data 2 car on est sur la data 1
                    // Changement du descriptif de la visualisation
                    $(".label1").html(dat2br);
                    // Changement du nombre
                    jQuery.each(data,function(){
                       if(this.Code == code){
                           nombre.textContent = this.Moy_sp_TGC;
                       }
                    });
                }
                else if(label.textContent == dat2){   // On va à la data 3 car on est sur la data 2
                    // Changement du descriptif de la visualisation
                    $(".label1").html(dat3br);
                    // Suppression de la carte de la région et du nombre
                    svg.innerHTML="";
                    nombre.innerHTML="";
                    // Ajout du donut 
                    d3.select(".apresRegion1").append("div").attr("id","doughnutChart").attr("class","chart");
                    init_var();
                    donut_animee(code);
                }
                else{   // On va à la data 1 car on est sur la data 3
                    // Changement du descriptif de la visualisation
                    $(".label1").html(dat1br);
                    // Suppression du donut
                    $('div').remove('#doughnutChart');
                    // Ajout du nombre et de la carte de la région
                    jQuery.each(data,function(){
                       if(this.Code == code){
                           nombre.textContent = this.Moy_sp_DOC_region;
                           var d = jQuery.getJSON("./JSON/regions.json", function(don){
                                jQuery.each(don, function(){
                                    if(this.code == code){
                                        d3.select(".svg").append("path").attr("d",this.path).attr("fill","#A77548").attr("id","chemin");
                                    }
                                });
                           });
                       }
                    });
                }
            }
            else{ // Dans le cas du clique sur une fléche gauche
                if(label.textContent == dat1){ // On va à la data 3 car on est sur la data 1
                // Changement du descriptif de la visualisation
                    $(".label1").html(dat3br);
                    // Suppression de la carte de la région et du nombre
                    svg.innerHTML="";
                    nombre.innerHTML="";
                    // Ajout du donut
                    d3.select(".apresRegion1").append("div").attr("id","doughnutChart").attr("class","chart");
                    init_var();
                    donut_animee(code);
                }
                else if(label.textContent == dat2){  // On va à la data 1 car on est sur la data 2
                // Changement du descriptif de la visualisation
                    $(".label1").html(dat1br);
                    // Changement du nombre
                    jQuery.each(data,function(){
                       if(this.Code == code){
                           nombre.textContent = this.Moy_sp_DOC_region;
                       }
                    });
                }
                else{  // On va à la data 2 car on est sur la data 3
                // Changement du descriptif de la visualisation
                    $(".label1").html(dat2br);
                    // Suppression du donut
                    $('div').remove('#doughnutChart');
                    // Ajout de la carte de la région et du nombre
                    jQuery.each(data,function(){
                       if(this.Code == code){
                           nombre.textContent = this.Moy_sp_TGC;
                           var d = jQuery.getJSON("./JSON/regions.json", function(don){
                                jQuery.each(don, function(){
                                    if(this.code == code){
                                        d3.select(".svg").append("path").attr("d",this.path).attr("fill","#A77548").attr("id","chemin");
                                    }
                                });
                           });
                       }
                    });
                }
            }        
        });
    }
    else if(i == 3){ // Dans le cas de la dataviz 3
        var dat1 = "Montant attribué par la Région  à la production de documentaires";
        var dat2 = "Montant attribué par la Région à la production audiovisuelle  et cinématographique (tous genres confondus)";
        var dat3 = "Part des financements attribués à la production documentaire  par rapport à la production tous genres confondus";
        
        var dat1br = "Montant attribué par la Région </br> à la production de documentaires";
        var dat2br = "Montant attribué par la Région à la production audiovisuelle </br> et cinématographique (tous genres confondus)";
        var dat3br = "Part des financements attribués à la production documentaire </br> par rapport à la production tous genres confondu";
        
        var nombre = document.getElementsByClassName("nombre3")[0];
        var label = document.getElementsByClassName("label3")[0];
    
        var svg = document.getElementsByClassName("svg3")[0];
        var code = svg.getAttribute("id");
        
        var json = jQuery.getJSON("./JSON/hyblab.json", function(data){
            if(sens == "droite"){   // Dans le cas du clique sur une fléche droite
                if(label.textContent == dat1){  // On va à la data 2
                    //label.textContent = dat2br;
                    $(".label3").html(dat2br);
                    jQuery.each(data,function(){
                       if(this.Code == code){
                           nombre.textContent = this.Moy_aides_TGC;
                       }
                    });
                }
                else if(label.textContent == dat2){   // On va à la data 3
                    //label.textContent = dat3br;
                    $(".label3").html(dat3br);
                    svg.innerHTML="";
                    nombre.innerHTML="";
                    d3.select(".apresRegion3").append("div").attr("id","doughnutChart").attr("class","chart");
                    init_var();
                    donut_animee(code);
                }
                else{   // On va à la data 1
                    //label.textContent = dat1br;
                    $(".label3").html(dat1br);
                    $('div').remove('#doughnutChart');
                    jQuery.each(data,function(){
                       if(this.Code == code){
                           nombre.textContent = this.Moy_aides_region;
                           var d = jQuery.getJSON("./JSON/regions.json", function(don){
                                jQuery.each(don, function(){
                                    if(this.code == code){
                                        d3.select(".svg3").append("path").attr("d",this.path).attr("fill","#A77548").attr("id","chemin");
                                    }
                                });
                           });
                           
                       }
                    });
                }
            }
            else{ // Dans le cas du clique sur une fléche gauche
                if(label.textContent == dat1){ // On va à la data 3
                    //label.textContent = dat3br;
                    $(".label3").html(dat3br);
                    svg.innerHTML="";
                    nombre.innerHTML="";
                    d3.select(".apresRegion3").append("div").attr("id","doughnutChart").attr("class","chart");
                    init_var();
                    donut_animee(code);
                }
                else if(label.textContent == dat2){  // On va à la data 1
                    //label.textContent = dat1;
                    $(".label3").html(dat1br);
                    jQuery.each(data,function(){
                       if(this.Code == code){
                           nombre.textContent = this.Moy_aides_region;
                       }
                    });
                }
                else{  // On va à la data 2
                    //label.textContent = dat2br;
                    $(".label3").html(dat2br);
                    $('div').remove('#doughnutChart');
                    jQuery.each(data,function(){
                       if(this.Code == code){
                           nombre.textContent = this.Moy_aides_TGC;
                           var d = jQuery.getJSON("./JSON/regions.json", function(don){
                                jQuery.each(don, function(){
                                    if(this.code == code){
                                        d3.select(".svg3").append("path").attr("d",this.path).attr("fill","#A77548").attr("id","chemin");
                                    }
                                });
                           });
                       }
                    });
                }
            }        
        });
    }
}


// Fonction qui désépaissis la flèche lors du survol
function desepaissir(sens){
    if(sens == "gauche"){
        var fleche = document.getElementById("flechegauche");
        fleche.src="Logos/fleche-data-gauche-fin.svg";
    }
    else if(sens == "droite"){
        var fleche = document.getElementById("flechedroite");
        fleche.src="Logos/fleche-data-droite-fin.svg";
    }
}

// Fonction qui épaissis la flèche lors du survol
function epaissir(sens){
    if(sens == "gauche"){
        var fleche = document.getElementById("flechegauche");
        fleche.src="Logos/fleche-data-gauche-large.svg";
    }
    else if(sens == "droite"){
        var fleche = document.getElementById("flechedroite");
        fleche.src="Logos/fleche-data-droite-large.svg";
    }
}