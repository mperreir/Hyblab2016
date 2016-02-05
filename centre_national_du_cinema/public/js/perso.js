"use strict";

$(document).ready(function() {  

  var can_change = false;
  var can_change2 = false;



  var response = null;
  var city = null;

  $.getJSON( "./json/dataviz1.json", function() {
    console.log( "success" );
  })
  .done(function(data) {
    console.log( "second success" );
    response = data;

  })
  .fail(function() {
    console.log( "error" );
  })
  .always(function() {
    console.log( "complete" );

    var selectionner = "Sélectionner la région..";

    if(response != null){
        
      $('#section3_select').change(function() {
        if(can_change==false){
          can_change = true;   
        }else{
          if(city.localeCompare(selectionner) != 0){          
            city = $(this).val();
            displayInfos(response, city);  
          }     
        }
      }).change();
        
        $('#section3_select2').change(function() {
            if(can_change2==false){
                can_change2 = true;   
            }else{
                city = $(this).val();
                if(city.localeCompare(selectionner) != 0){
                  displayInfos(response, city);
                  $("#section3_select").val($("#section3_select2").val());
                  $(".legend").css('display',"block"); 
                  $("#section3_select").css('display',"block"); 

                  $("#section3_select2").css('display',"none"); 
                }
       
            }
        }).change();

      $(".perso").click(function() {

        $(".legend").css('display',"block"); 
        $("#section3_select").css('display',"block"); 
        $("#section3_select2").css('display',"none");  

        city = $( this ).attr("data-region");
        $("#section3_select").val(city);
        displayInfos(response, city);
                      
      });
    }
  });

  function displayInfos(response, city){
        var total = 'TOTAL';
        var nb_entree_tot= null;
        var moy_nat_rme = null;
        var moy_nat_indice = null;

        var nb_entree = null;
        var moy = null;

        var rme_region= null;
        var indice_region= null;

        $.each(response, function( key, val ) {
          if(total.localeCompare(val['VILLE']) == 0){

          nb_entree_tot = val['ENTREES'];
          moy_nat_rme = val['RME'];
          moy_nat_indice = val['INDICE'];

          }
        });

        $.each(response, function( key, val ) {
         if(city.localeCompare(val['VILLE']) == 0){
          nb_entree = val['ENTREES'];
          rme_region = val['RME'];
          indice_region = val['INDICE'];

          var moy = nb_entree/nb_entree_tot*100;

          $(".btns_section3").html("");

          $(".btns_section3").append('<div class="col-md-4 col-sm-4 "><button class="section3_btn_entree btn btn-default">La fréquentation</button></div><div class="col-md-4 col-sm-4"><button class="section3_btn_rme btn btn-default">La RME</button></div><div class="col-md-4 col-sm-4"><button class="section3_btn_indice btn btn-default">L\'indice de fréquentation</button></div>')

          $( '.section3_title').html("");
          $( '.section3_dataviz').html("");

          $('.section3_title').append('<h3 class="title_dataviz1">Pourcentage des entrées nationales en 2014<br><span class="name_of_region">'+val['VILLE'].toString()+'</span></h3>');
          $('.section3_dataviz').append('<input type="text" value="'+moy.toFixed(1).replace('.',',')+'%" class="round">');


          $('input.round').wrap('<div class="round" />');
          var $input = $('input.round');
          var $div = $input.parent();

          var ratio = $input.val().replace(',','.').replace('%','')/100;

          $circle = $('<canvas width="200px" height="200px" />');
          $color = $('<canvas width="200px" height="200px" />');

          $div.append($circle);
          $div.append($color);

          var ctx = $circle[0].getContext('2d');
          ctx.beginPath();
          ctx.arc(100,100,85,0,2*Math.PI);
          ctx.lineWidth = 20;
          ctx.strokeStyle = '#FFF';
          ctx.shadowOffsetX = 2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(0,0,0,0.1)";
          ctx.stroke();

          var ctx = $color[0].getContext('2d');
          ctx.beginPath();
          ctx.arc(100,100,85,-1/2* Math.PI, ratio*2*Math.PI - 1/2* Math.PI);
          ctx.lineWidth = 20;
          ctx.strokeStyle = '#F2705B';
          ctx.stroke();

          $('.section3_btn_entree').click(function(){

            $('.section3_title').html("");
            $('.section3_dataviz').html("");

            $('.section3_title').append('<h3 class="title_dataviz1">Pourcentage des entrées nationales en 2014<br><span class="name_of_region">'+val['VILLE'].toString()+'</span></h3>');
            $('.section3_dataviz').append('<input type="text" value="'+moy.toFixed(1).replace('.',',')+'%" class="round">');

            $('input.round').wrap('<div class="round" />');
            var $input = $('input.round');
            var $div = $input.parent();

            var ratio = $input.val().replace(',','.').replace('%','')/100;

            $circle = $('<canvas width="200px" height="200px" />');
            $color = $('<canvas width="200px" height="200px" />');

            $div.append($circle);
            $div.append($color);

            var ctx = $circle[0].getContext('2d');
            ctx.beginPath();
            ctx.arc(100,100,85,0,2*Math.PI);
            ctx.lineWidth = 20;
            ctx.strokeStyle = '#FFF';
            ctx.shadowOffsetX = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(0,0,0,0.1)";
            ctx.stroke();

            var ctx = $color[0].getContext('2d');
            ctx.beginPath();
            ctx.arc(100,100,85,-1/2* Math.PI, ratio*2*Math.PI - 1/2* Math.PI);
            ctx.lineWidth = 20;
            ctx.strokeStyle = '#F2705B';
            ctx.stroke();

            $(".section3_dataviz").css('height',"215px");          
          });

          $('.section3_btn_rme').click(function(){

            $( '.section3_title').html("");
            $( '.section3_dataviz').html("");        

            $('.section3_title').append('<h3 class="title_dataviz1">Recette moyenne par entrée comparée à la moyenne nationale en 2014<br><span class="name_of_region">'+val['VILLE'].toString()+'</span></h3>');

            if(rme_region.toFixed(2) < moy_nat_rme.toFixed(2)){
              var diff = moy_nat_rme.toFixed(2) - rme_region.toFixed(2);
              $('.section3_dataviz').append('<div class="circle-prix"><div>'+rme_region.toFixed(2).replace('.',',')+'€ SOIT -'+diff.toFixed(2).replace('.',',')+'€ </div></div><div class="circle-prix-moyen"><div>MOYENNE NATIONALE <br> '+moy_nat_rme.toFixed(2).replace('.',',')+'€</div></div>');
              $(".circle-prix").css({'opacity':0.7,'z-index':2,'width': 200 - diff.toFixed(1)*100/2+"px"});
              $(".circle-prix-moyen").css({'z-index':1,'width':200+"px"});
              $(".section3_dataviz").css('height','215px');          
            }
            else{
              var diff = rme_region.toFixed(2) - moy_nat_rme.toFixed(2);
              $('.section3_dataviz').append('<div class="circle-prix"><div>'+rme_region.toFixed(2).replace('.',',')+'€ SOIT +'+diff.toFixed(2).replace('.',',')+'€</div></div><div class="circle-prix-moyen"><div>MOYENNE NATIONALE <br> '+moy_nat_rme.toFixed(2).replace('.',',')+'€</div></div>');
              $(".circle-prix").css({'z-index':1,'width': 200+"px"});
              $(".circle-prix-moyen").css({'opacity':0.7,'z-index':2,'width':200 - diff.toFixed(1)*100/2+"px"});
              $(".section3_dataviz").css('height','215px');          
            }
          });

          $('.section3_btn_indice').click(function(){
            $( '.section3_title').html("");
            $( '.section3_dataviz').html("");

            $('.section3_title').append('<h3 class="title_dataviz1_graph3">Indice de fréquentation comparé à la moyenne nationale en 2014<br><span class="name_of_region">'+val['VILLE'].toString()+'</span></h3>');

            $('.section3_dataviz').append('<div class="circle-indice"><div>'+indice_region.toFixed(2).replace('.',',')+'</div></div><div class="circle-indice-moyen"><div>MOYENNE NATIONALE <br> '+moy_nat_indice.toFixed(2).replace('.',',')+'</div></div>');
            if((indice_region.toFixed(1)*10) < (moy_nat_indice.toFixed(1)*10)){
              var diff = moy_nat_indice.toFixed(2) - indice_region.toFixed(2);
              console.log(moy_nat_indice.toFixed(2) +" "+ indice_region.toFixed(2));
              console.log(diff);
              if(diff<1){
                diff = diff.toFixed(1)*100
              }else{
                diff = diff.toFixed(1)*100 - 100
              }
              $(".circle-indice").css({'opacity':0.7,'z-index':2,'width': 200 -diff+"px"});
              $(".circle-indice-moyen").css({'z-index':1,'width':200+"px"});
              $(".section3_dataviz").css('height','215px');
            }
            else{
              var diff = indice_region.toFixed(2) -moy_nat_indice.toFixed(2);
              console.log(moy_nat_indice.toFixed(2) +" "+ indice_region.toFixed(2));
              console.log(diff);
              if(diff<1){
                diff = diff.toFixed(1)*100
              }else{
                diff = diff.toFixed(1)*100 - 100
              }
              $(".circle-indice").css({'z-index':1,'width': 200+"px"});
              $(".circle-indice-moyen").css({'opacity':0.7,'z-index':2,'width':200-diff.toFixed(1)*10+"px"});
              $(".section3_dataviz").css('height','215px');          
            }
          }); 

        }
      });    
  }

});