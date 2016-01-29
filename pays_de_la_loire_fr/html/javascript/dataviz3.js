'use strict';

fullpage.initialize('#container', {
  anchors: ['firstPage', 'secondPage', '3rdPage', '4thpage', '5thpage', '6thpage', '7thpage', '8thpage', 'lastPage'],
  menu: '#menu',
  slidesNavigation: true,
  slidesNavPosition: 'bottom',
  navigation: true,
  navigationPosition: 'right',
  css3:true
});



function rand(a){ // returns an int between 0 and a.
  return(Math.floor(Math.random()*a));
} 

function animUp(){
  this.animate({d:"M0 450 C 80 450, 80 440, 120 440 C 160 440, 160 450, 240 450 V 500 H -240 z"}, 2000, mina.easeinout, animLow);
}
function animLow(){
  this.animate({d:"M0 450 C 80 450, 80 420, 120 420 C 160 420, 160 450, 240 450 V 500 H -240 z"},2000, mina.easeinout, animUp);
};

function animForth(){
  var dx = rand(50);
  this.animate({"transform":"t-50 0"},2000, mina.easeinout,animBack);
}

function animBack(){
  var dx = rand(50);
  this.animate({"transform":"t0 0"},2000, mina.easeinout,animForth);
}
function waves(){
  var s = Snap("#svg_dataviz3");

  var w1 = s.path("M0 450 C 80 450, 80 440, 120 440 C 160 440, 160 450, 240 450 V 500 H -240 z")
  .attr({
    fill: "#61cdff",
     "fill-opacity": 0.5,
  })
  .animate({
  d:"M0 450 C 80 450, 80 420, 120 420 C 160 420, 160 450, 240 450 V 500 H -240 z"},2000,mina.easeinout,animUp)
  .pattern(0, 0, 240, 501);
  
  s.rect(0,0,screen.width+200,500).attr({
      fill: w1
  }).animate({"transform":"t-50 0"},2000, mina.easeinout,animBack);

  var w2 = s.path("M0 450 C 80 450, 80 440, 120 440 C 160 440, 160 450, 240 450 V 500 H -240 z")
  .attr({
    fill: "#0d65bf",
     "fill-opacity": 0.5,
  })
  .animate({
  d:"M0 450 C 80 450, 80 420, 120 420 C 160 420, 160 450, 240 450 V 500 H -240 z"},0,mina.easeinout,animUp)
  .pattern(0, 0, 240, 501);
  
  s.rect(0,0,screen.width+200,500).attr({
      fill: w2
  }).animate({"transform":"t-50 0"},2000, mina.easeinout,animForth);

  var w3 = s.path("M0 450 C 80 450, 80 440, 120 440 C 160 440, 160 450, 240 450 V 500 H -240 z")
  .attr({
    fill: "#0b4d90",
     "fill-opacity": 0.5,
  })
  .animate({
  d:"M0 450 C 80 450, 80 420, 120 420 C 160 420, 160 450, 240 450 V 500 H -240 z"},1000,mina.easeinout,animUp)
  .pattern(0, 0, 240, 501);
  
  s.rect(0,0,screen.width+200,500).attr({
      fill: w3
  }).animate({"transform":"t-50 0"},2000, mina.easeinout,animForth);
}

waves();