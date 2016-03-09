'use strict';

/** Fonction permettant de coloré la map suivant les valeures **/
function colorMap(moy,idDiv) {
    var body=document.body;
    var data= $.getJSON("./JSON/hyblab.json", function (donnees) {
      jQuery.each(donnees, function () {
          var d = document.getElementById(idDiv);
          var p = d.children[0].children[0].children[1].children;
          var path;
          
          /*Recherche de la région*/
          for(var i=0 ; i < p.length ; i++) {
            if (p[i].getAttribute("data-code") == this.Code) {
              path = p[i];
            }
          }
          /*Coloriage*/
          if(moy == "Moy_sp_DOC_region"){
            if((0 <= this[moy])  && (this[moy] <= 5)){
              path.setAttribute("fill","#FAEAC7");
            }
            else if((6 <= this[moy])  && (this[moy] <= 10)){
              path.setAttribute("fill","#EBD5B8");
            }
            else if((11 <= this[moy])  && (this[moy] <= 15)){
              path.setAttribute("fill","#DBA774");
            }
            else if(15 <= this[moy]){
              path.setAttribute("fill","#A77548");
            }
          }
          else if (moy == "Moy_auteur"){
            if((0 <= this[moy])  && (this[moy] <= 25)){
              path.setAttribute("fill","#FAEAC7");
            }
            else if((26 <= this[moy])  && (this[moy] <= 50)){
              path.setAttribute("fill","#EBD5B8");
            }
            else if((51 <= this[moy])  && (this[moy] <= 75)){
              path.setAttribute("fill","#DBA774");
            }
            else if(76 <= this[moy]){
              path.setAttribute("fill","#A77548");
            }
          }
          else if (moy == "Moy_aides_region"){
            if((0 <= this[moy])  && (this[moy] <= 328116)){
              path.setAttribute("fill","#FAEAC7");
            }
            else if((328117 <= this[moy])  && (this[moy] <= 656232)){
              path.setAttribute("fill","#EBD5B8");
            }
            else if((656232 <= this[moy])  && (this[moy] <= 984348)){
              path.setAttribute("fill","#DBA774");
            }
            else if(984349 <= this[moy]){
              path.setAttribute("fill","#A77548");
            }
          }
        });
    })
      .done(function(){
        console.log("success");
        
      })
      .fail(function(){
        console.log("error");
      });
}

/** Fonction permettant de mettre le fond de la carte en gris **/
function colorBackgroundMap(){
  var div = document.getElementsByClassName("jvectormap-container");
  for(var i=0 ; i < div.length ; i++){
      div[i].setAttribute("style","background-color : rgb(255,255,255);")
  }
}