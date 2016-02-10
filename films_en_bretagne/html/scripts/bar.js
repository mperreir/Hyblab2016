'use strict';

function bar_a_jour(){
setTimeout(function start (){
  var nbre_auteurs_provinces2=0;
  var nbre_auteurs_provinces3=0;
  var nbre_auteurs_provinces4=0;
  var data= $.getJSON("./JSON/hyblab.json",function(donnees){
             jQuery.each(donnees, function(){ 
                 if(this.Regions!="Ile-de-France"){
                     nbre_auteurs_provinces2=nbre_auteurs_provinces2+this.Deux.Nb_auteurs;
                     nbre_auteurs_provinces3=nbre_auteurs_provinces3+this.Trois.Nb_auteurs;
                     nbre_auteurs_provinces4=nbre_auteurs_provinces4+this.Quatre.Nb_auteurs;
                 }
                 else{
                     d3.select("#Deux").append("div").attr("class","bar cf").attr("data-percent",this.Deux.Nb_auteurs).attr("id","IDF2");
                     d3.select("#Trois").append("div").attr("class","bar cf").attr("data-percent",this.Trois.Nb_auteurs).attr("id","IDF3");
                     d3.select("#Quatre").append("div").attr("class","bar cf").attr("data-percent",this.Quatre.Nb_auteurs).attr("id","IDF4");
                     d3.select("#IDF2").append("span").attr("class","label");
                     d3.select("#IDF3").append("span").attr("class","label");
                     d3.select("#IDF4").append("span").attr("class","label");
                 }
            });
  d3.select("#Deux").append("div").attr("class","bar cf").attr("data-percent", nbre_auteurs_provinces2).attr("id","Province2");
  d3.select("#Trois").append("div").attr("class","bar cf").attr("data-percent", nbre_auteurs_provinces3).attr("id","Province3");
  d3.select("#Quatre").append("div").attr("class","bar cf").attr("data-percent", nbre_auteurs_provinces4).attr("id","Province4");
  d3.select("#Province2").append("span").attr("class","label");
  d3.select("#Province3").append("span").attr("class","label");
  d3.select("#Province4").append("span").attr("class","label");
  
  $('.bar').each(function(i){  
    var $bar = $(this);
    $(this).append('<span class="count"></span>')
    
    setTimeout(function(){
      if ($bar.attr('data-percent')<1000){
         $bar.css('width', ($bar.attr('data-percent'))*1.8); 
      }
      else{
         $bar.css('width', ($bar.attr('data-percent'))/4);
      }
      $("#Province2").css('width', ($("#Province2").attr('data-percent'))/4);
      $("#Province3").css('width', ($("#Province3").attr('data-percent'))/4);
      $("#Province4").css('width', ($("#Province4").attr('data-percent'))/4);
      $("#IDF2").css('width', ($("#IDF2").attr('data-percent'))/4);
      $("#IDF3").css('width', ($("#IDF3").attr('data-percent'))/4);
      $("#IDF4").css('width', ($("#IDF4").attr('data-percent'))/4);
      
    }, i*100);
  });

$('.count').each(function () {
    $(this).prop('Counter',0).animate({
        Counter: $(this).parent('.bar').attr('data-percent')
    }, {
        duration: 2000,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now) );
        }
    });
});

}, 500)
});
}

function bar_region(a){
    var data= $.getJSON("./JSON/hyblab.json",function(donnees){
             jQuery.each(donnees, function(){ 
                 if(this.Code==a){
                     d3.select("#Deux").append("div").attr("class","bar cf").attr("data-percent",this.Deux.Nb_auteurs).attr("id","Region2");
                     d3.select("#Trois").append("div").attr("class","bar cf").attr("data-percent",this.Trois.Nb_auteurs).attr("id","Region3");
                     d3.select("#Quatre").append("div").attr("class","bar cf").attr("data-percent",this.Quatre.Nb_auteurs).attr("id","Region4");
                     d3.select("#Region2").append("span").attr("class","label");
                     d3.select("#Region3").append("span").attr("class","label");
                     d3.select("#Region4").append("span").attr("class","label");
                 }
            });
    });

}
