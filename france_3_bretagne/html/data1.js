'use strict';


var angle = 0; //Angle pour l'animation du cercle sur les disques

var selectedButton = document.getElementById('prx_ext'); //Bouton de la légende sélectionné

var requestId; //Variable nécessaire pour arrêter l'animation lorsque la souris sort du cercle

var mainCanvas=document.getElementById("canvasCarte");
var mainContext=mainCanvas.getContext("2d");

var canvasLegende=document.getElementById('canvasLegende').getContext('2d');

var canvasWidth = mainCanvas.width;
var canvasHeight = mainCanvas.height;

var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
                            
//Selection du bouton à l'initialisation                            
selectButton(selectedButton);
                            
//Dessin cercle de chargement
function initDrawCircle(button) {
  angle = 0;
  drawCircle(button);
}

function drawCircle(button) {
  
  mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
  
  //color
  mainContext.strokeStyle='#06BBBD';
  
  //width
  mainContext.lineWidth=3;
   
  // draw the circle
  mainContext.beginPath();
  var radius = button.r.animVal.value + 3;
  mainContext.arc(button.cx.baseVal.value, button.cy.baseVal.value, radius, 0, angle, false);
   
  mainContext.stroke();  
  angle += Math.PI / 10;
  
  
  if (angle >= 2.5*Math.PI)
  {
    window.cancelAnimationFrame(requestId);
    return;
  }

  requestId = requestAnimationFrame(function() {
    drawCircle(button)
    
  });
  
  
  
}

//Dessine un cercle autour du bouton selectionné
function selectButton(button) {
  
  canvasLegende.clearRect(0, 0, canvasWidth, canvasHeight);
  
  //color
  canvasLegende.strokeStyle='#06BBBD';
  
  //width
  canvasLegende.lineWidth=3;
  
  selectedButton = button
  
  canvasLegende.beginPath();
  var radius = selectedButton.r.animVal.value + 3;
  canvasLegende.arc(selectedButton.cx.baseVal.value, selectedButton.cy.baseVal.value, radius, 0, Math.PI*3, false);
   
  canvasLegende.stroke();  
  
}

//Arret de l'animation
function clearCanvas() {
  angle = 0;
  mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
  window.cancelAnimationFrame(requestId);
  //On redessine quand même le cercle car le bouton est toujours sélectionné
  selectButton(selectedButton);
  
}

//Apparition des disques correspondant aux différentes valeurs
function showCircles(classe) {
  
  var classes = document.getElementsByClassName(classe);
  for(var i=0;i<classes.length;i++) {
    classes[i].style.visibility='visible';
  }
  
  hideOthers(classe);
  hideNumbers();
  
}

// On cache les cercles déjà apparents lorsque l'on fait apparaitre ceux d'une autre classe
function hideOthers(classe) {
  
  if (classe != "prix") {
    var classes = document.getElementsByClassName("prix");
    for(var i=0;i<classes.length;i++) {
      classes[i].style.visibility='hidden';
    }
  }
    
  if (classe != "lgt") {
    var classes = document.getElementsByClassName("lgt");
    for(var i=0;i<classes.length;i++) {
      classes[i].style.visibility='hidden';
    }
  }
  
  if (classe != "capa") {
    var classes = document.getElementsByClassName("capa");
    for(var i=0;i<classes.length;i++) {
      classes[i].style.visibility='hidden';
    }
  }
  
}

//Fait apparaître les chiffres correspondants à un disque
function showNumbers(id) {
  
  var nombre = document.getElementById(id);
  if (nombre.style.visibility=='hidden') {
    nombre.style.visibility='visible';  
  }
  else nombre.style.visibility='hidden';
  
}

//Cache les chiffres
function hideNumbers() {
  var classes = document.getElementsByClassName("chiffres");
    for(var i=0;i<classes.length;i++) {
      classes[i].style.visibility='hidden';
    }
}


function showJauge(id) {
  var jauge;

  if (id == 'prix_moyen')
  {
    jauge = document.getElementById('jauge_prix');
    jauge.src="images/Data1-jauge-prix.gif";
    document.getElementById('jauge_capa').src="images/DATA1-JAUGES-CAPACITE.png"
  }
  else
  {
    jauge = document.getElementById('jauge_capa');
    jauge.src="images/Data1-jauge-capacite.gif";
    document.getElementById('jauge_prix').src="images/DATA1-JAUGES-PRIX.png"
  }
  
  
}
