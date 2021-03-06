"use strict";

$(document).ready(function() {

	console.log( "document ready!" );

	var nom_1, value_1 = null;
	var nom_2, value_2 = null;

    function number_format(number, decimals, dec_point, thousands_sep) {

      number = (number + '')
        .replace(/[^0-9+\-Ee.]/g, '');
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
          var k = Math.pow(10, prec);
          return '' + (Math.round(n * k) / k)
            .toFixed(prec);
        };
      // Fix for IE parseFloat(0.55).toFixed(0) = 0;
      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
        .split('.');
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      if ((s[1] || '')
        .length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1)
          .join('0');
      }
      return s.join(dec);
    }

    
	function positionner(cible, img, GX, DX, GY, BY){
		var pos_img = img.position();

		var top = GY*(img.width())/2000;
		var left = GX*(img.width())/2000;
		var height = BY*(img.width())/2000 - (top+pos_img['top']);
		var width = DX*(img.width())/2000 - GX*(img.width())/2000;
		cible.css({"position":"absolute","top":top+pos_img['top']+"px","left":left+pos_img['left']+"px","height":height+"px","width":width+"px"});
	}

	function positionnerTete(cible, img, GX, DX, GY, BY){
		var pos_img = img.position();

		var top = GY*(img.width())/2000;
		var left = GX*(img.width())/2000;
		var height = BY*(img.width())/2000 - (top+pos_img['top']);
		var width = DX*(img.width())/2000 - GX*(img.width())/2000;
		cible.css({"cursor":"pointer","position":"absolute","top":top+pos_img['top']+"px","left":left+pos_img['left']+"px","height":height+"px","width":width+"px"});
	}

	$("#fullpage").imagesLoaded()
	  .done( function( instance ) {
	    console.log('all images successfully loaded');

	    positionner($('#ecran_section3'),$('#salleCine_section3'),110, 1907,57,853);
	    positionner($('#ecran_section4'),$('#salleCine_section4'),0, 2000,60,1082);
	    positionner($('#ecran_section5'),$('#salleCine_section5'),177,1830,236,1060);

	    positionner($('#ecran_section5_2'),$('#salleCine_section5_2'),0, 2000,60,1082);
	   	positionner($('#ecran_section5_2'),$('#salleCine_section5_2'),0, 2000,60,1082);


	    positionner($('#ecran_section6'),$('#salleCine_section6'),177,1830,236,1060);

		positionnerTete($('#perso1_section3'),$('#salleCine_section3'),71, 141,898,955);
		positionnerTete($('#perso2_section3'),$('#salleCine_section3'),28, 127,969,1068);
		positionnerTete($('#perso3_section3'),$('#salleCine_section3'),212, 311,926,1011);
		positionnerTete($('#perso4_section3'),$('#salleCine_section3'),155, 297,1012,1139);
		positionnerTete($('#perso5_section3'),$('#salleCine_section3'),382, 481,983,1068);
		positionnerTete($('#perso6_section3'),$('#salleCine_section3'),439, 538,884,955);
		positionnerTete($('#perso7_section3'),$('#salleCine_section3'),425, 595,1068,1210);
		positionnerTete($('#perso8_section3'),$('#salleCine_section3'),595, 736,870,955);
		positionnerTete($('#perso9_section3'),$('#salleCine_section3'),609, 736,997,1096);
		positionnerTete($('#perso10_section3'),$('#salleCine_section3'),750, 822,940,1011);
		positionnerTete($('#perso11_section3'),$('#salleCine_section3'),1006, 1133,1040,1139);
		positionnerTete($('#perso12_section3'),$('#salleCine_section3'),977, 1077,983,1025); 
		positionnerTete($('#perso13_section3'),$('#salleCine_section3'),1204, 1275,926,983); 
		positionnerTete($('#perso14_section3'),$('#salleCine_section3'),1303, 1389,983,1068); 
		positionnerTete($('#perso15_section3'),$('#salleCine_section3'),1403, 1516,1040,1139); 
		positionnerTete($('#perso16_section3'),$('#salleCine_section3'),1544, 1715,1068,1196); 
		positionnerTete($('#perso17_section3'),$('#salleCine_section3'),1417, 1488,926,997); 
		positionnerTete($('#perso18_section3'),$('#salleCine_section3'),1516, 1615,955,1011); 
		positionnerTete($('#perso19_section3'),$('#salleCine_section3'),1629, 1743,969,1054); 
		positionnerTete($('#perso20_section3'),$('#salleCine_section3'),1757, 1856,940,1010); 
		positionnerTete($('#perso21_section3'),$('#salleCine_section3'),1785, 1927,1000,1125);	

		$('.section5_row').html("");
		/*$('.section5_row').append('<div class="col-md-4 col-sm-4" id="section5_carte_1"></div><div class="col-md-4 col-sm-4" id="section5_data"><div class="row"><div class="col-md-12 col-sm-12"><div class="row popcorn_row"><div id ="section5_dataviz1_ville1" class="donneesPopcorn col-md-4 col-sm-4"></div><div class="col-md-4 col-sm-4"><img class="popcorn_img" src="img/pop_entrees.png" id="popcorn1_ville1" alt=""></div><div id ="section5_dataviz1_ville2" class="donneesPopcorn col-md-4 col-sm-4"></div></div><div class="row popcorn_row"><div id ="section5_dataviz2_ville1" class="donneesPopcorn col-md-4 col-sm-4"></div><div class="col-md-4 col-sm-4"><img class="popcorn_img" src="img/pop_rme.png" id="popcorn1_ville1" alt=""></div><div id ="section5_dataviz2_ville2" class="donneesPopcorn col-md-4 col-sm-4"></div></div><div class="row popcorn_row"><div id ="section5_dataviz3_ville1" class="donneesPopcorn col-md-4 col-sm-4"></div><div class="col-md-4 col-sm-4"><img class="popcorn_img" src="img/pop_indicefreq.png" id="popcorn1_ville1" alt=""></div><div id ="section5_dataviz3_ville2" class="donneesPopcorn col-md-4 col-sm-4"></div></div></div></div></div><div class="col-md-4 col-sm-4" id="section5_carte_2" style="padding:0"></div>');*/
          $('.section5_row').append('<table style="width:100%;text-align:center;font-family:geosanslightregular;font-size:120%"><tr><td rowspan="3" id="section5_carte_1" style="width:33%"></td><td id="section5_dataviz1_ville1" style="width:11%"></td><td style="width:11%"><img class="popcorn_img" src="img/pop_entrees.png" id="popcorn1_ville1" alt=""></td><td id ="section5_dataviz1_ville2" style="width:11%"></td><td rowspan="3" id="section5_carte_2" style="width:33%"></td></tr><tr><td id ="section5_dataviz2_ville1" style="width:11%"></td><td style="width:11%"><img class="popcorn_img" src="img/pop_rme.png" id="popcorn1_ville1" alt=""></td><td id ="section5_dataviz2_ville2" style="width:11%"></td></tr><tr><td id ="section5_dataviz3_ville1" style="width:11%"></td><td style="width:11%"><img class="popcorn_img" src="img/pop_indicefreq.png" id="popcorn1_ville1" alt=""></td><td id ="section5_dataviz3_ville2" style="width:11%"></td></tr></table>');

		doMap();

		$('#chart_section5_2').highcharts().setSize($('#ecran_section5_2').width(),$('#ecran_section5_2').height());

		$('#section5_carte_1').highcharts().setSize($('#ecran_section6').width()/3,$('#ecran_section6').height() - $( ".row_slider" ).height() - 15);
		$('#section5_carte_2').highcharts().setSize($('#ecran_section6').width()/3,$('#ecran_section6').height() - $( ".row_slider" ).height() - 15);

		
		$('#section5_dataviz').css('height',$('#ecran_section6').height()  - $( ".row_slider" ).height() - 15);
		$(".btns_section3").css('width',$('#ecran_section3').width());	
	  })
	  .fail( function() {
	    console.log('Fail');
	});

	$( window ).resize(function() {
	
		$("#fullpage").imagesLoaded()
		  .done( function( instance ) {
		    console.log('all images successfully loaded');

		    positionner($('#ecran_section3'),$('#salleCine_section3'),110, 1907,57,853);
	    	positionner($('#ecran_section4'),$('#salleCine_section4'),0, 2000,60,1082);
	    	positionner($('#ecran_section5'),$('#salleCine_section5'),177,1830,236,1060);
	    	positionner($('#ecran_section5_2'),$('#salleCine_section5_2'),0, 2000,60,1082);

		    positionner($('#ecran_section6'),$('#salleCine_section6'),177,1830,236,1060);

			positionnerTete($('#perso1_section3'),$('#salleCine_section3'),71, 141,898,955);
			positionnerTete($('#perso2_section3'),$('#salleCine_section3'),28, 127,969,1068);
			positionnerTete($('#perso3_section3'),$('#salleCine_section3'),212, 311,926,1011);
			positionnerTete($('#perso4_section3'),$('#salleCine_section3'),155, 297,1012,1139);
			positionnerTete($('#perso5_section3'),$('#salleCine_section3'),382, 481,983,1068);
			positionnerTete($('#perso6_section3'),$('#salleCine_section3'),439, 538,884,955);
			positionnerTete($('#perso7_section3'),$('#salleCine_section3'),425, 595,1068,1210);
			positionnerTete($('#perso8_section3'),$('#salleCine_section3'),595, 736,870,955);
			positionnerTete($('#perso9_section3'),$('#salleCine_section3'),609, 736,997,1096);
			positionnerTete($('#perso10_section3'),$('#salleCine_section3'),750, 822,940,1011);
			positionnerTete($('#perso11_section3'),$('#salleCine_section3'),1006, 1133,1040,1139);
			positionnerTete($('#perso12_section3'),$('#salleCine_section3'),977, 1077,983,1025); 
			positionnerTete($('#perso13_section3'),$('#salleCine_section3'),1204, 1275,926,983); 
			positionnerTete($('#perso14_section3'),$('#salleCine_section3'),1303, 1389,983,1068); 
			positionnerTete($('#perso15_section3'),$('#salleCine_section3'),1403, 1516,1040,1139); 
			positionnerTete($('#perso16_section3'),$('#salleCine_section3'),1544, 1715,1068,1196); 
			positionnerTete($('#perso17_section3'),$('#salleCine_section3'),1417, 1488,926,997); 
			positionnerTete($('#perso18_section3'),$('#salleCine_section3'),1516, 1615,955,1011); 
			positionnerTete($('#perso19_section3'),$('#salleCine_section3'),1629, 1743,969,1054); 
			positionnerTete($('#perso20_section3'),$('#salleCine_section3'),1757, 1856,940,1010); 
			positionnerTete($('#perso21_section3'),$('#salleCine_section3'),1785, 1927,1000,1125);	

			$('.section5_row').html("");
			/*$('.section5_row').append('<div class="col-md-4 col-sm-4" id="section5_carte_1"></div><div class="col-md-4 col-sm-4" id="section5_data"><div class="row"><div class="col-md-12 col-sm-12"><div class="row popcorn_row"><div id ="section5_dataviz1_ville1" class="donneesPopcorn col-md-4 col-sm-4"></div><div class="col-md-4 col-sm-4"><img class="popcorn_img" src="img/pop_entrees.png" id="popcorn1_ville1" alt=""></div><div id ="section5_dataviz1_ville2" class="donneesPopcorn col-md-4 col-sm-4"></div></div><div class="row popcorn_row"><div id ="section5_dataviz2_ville1" class="donneesPopcorn col-md-4 col-sm-4"></div><div class="col-md-4 col-sm-4"><img class="popcorn_img" src="img/pop_rme.png" id="popcorn1_ville1" alt=""></div><div id ="section5_dataviz2_ville2" class="donneesPopcorn col-md-4 col-sm-4"></div></div><div class="row popcorn_row"><div id ="section5_dataviz3_ville1" class="donneesPopcorn col-md-4 col-sm-4"></div><div class="col-md-4 col-sm-4"><img class="popcorn_img" src="img/pop_indicefreq.png" id="popcorn1_ville1" alt=""></div><div id ="section5_dataviz3_ville2" class="donneesPopcorn col-md-4 col-sm-4"></div></div></div></div></div><div class="col-md-4 col-sm-4" id="section5_carte_2" style="padding:0"></div>');*/
              $('.section5_row').append('<table style="width:100%;text-align:center;font-family:geosanslightregular;font-size:120%"><tr><td rowspan="3" id="section5_carte_1" style="width:33%"></td><td id="section5_dataviz1_ville1" style="width:11%"></td><td style="width:11%"><img class="popcorn_img" src="img/pop_entrees.png" id="popcorn1_ville1" alt=""></td><td id ="section5_dataviz1_ville2" style="width:11%"></td><td rowspan="3" id="section5_carte_2" style="width:33%"></td></tr><tr><td id ="section5_dataviz2_ville1" style="width:11%"></td><td style="width:11%"><img class="popcorn_img" src="img/pop_rme.png" id="popcorn1_ville1" alt=""></td><td id ="section5_dataviz2_ville2" style="width:11%"></td></tr><tr><td id ="section5_dataviz3_ville1" style="width:11%"></td><td style="width:11%"><img class="popcorn_img" src="img/pop_indicefreq.png" id="popcorn1_ville1" alt=""></td><td id ="section5_dataviz3_ville2" style="width:11%"></td></tr></table>');
			
			$('#chart_section5_2').highcharts().setSize($('#ecran_section5_2').width(),$('#ecran_section5_2').height());

			doMap();

			$('#section5_carte_1').highcharts().setSize($('#ecran_section6').width()/3,$('#ecran_section6').height() - $( ".row_slider" ).height() - 15);
			$('#section5_carte_2').highcharts().setSize($('#ecran_section6').width()/3,$('#ecran_section6').height() - $( ".row_slider" ).height() - 15);
			

			$('#section5_dataviz').css('height',$('#ecran_section6').height()  - $( ".row_slider" ).height() - 15);
			$(".btns_section3").css('width',$('#ecran_section3').width());

		  })
	  	.fail( function() {
	    	console.log('Fail');
		});	

		// $('#videoPlayer').css({'width':$('#ecran').css('width'),'height':$('#ecran').css('height')})
	});

	function doMap(){
        
         Highcharts.setOptions({
            lang: {
                drillUpText: 'Retour'
            }
    });

        var chart_1 = null;
        var chart_2 = null;

	    var data = Highcharts.geojson(Highcharts.maps['countries/fr/fr-all']),
		// Some responsiveness
	    small = $('#section5_carte').width() < 400;

	    // Set drilldown pointers
	    $.each(data, function (i) {
	    	this.drilldown = this.properties['hc-key'];

			$("#section5_select1").append("<option>"+this.name+"</option>");
	        this.value = 50; 
		});
	            // Instanciate the map
	            $('#section5_carte_1').highcharts('Map', {
	                chart : {
	                    backgroundColor: null,
	                    events: {
	                        drilldown: function (e) {
	                            if (!e.seriesOptions) {
	                                var chart = this;
	                                var mapKey = 'countries/fr/',
	                                    name_file = e.point.drilldown + '-all';


	                                    // Handle error, the timeout is cleared on success
	                                    var fail = setTimeout(function () {
	                                        if (!Highcharts.maps[mapKey]) {
	                                            chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);

	                                            fail = setTimeout(function () {
	                                                chart.hideLoading();
	                                            }, 1000);
	                                        }
	                                    }, 3000);
	                                    
	                                // Show the spinner
	                                chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

	                                // Load the drilldown map
	                                $.getScript('js/lib_dept/' + name_file + '.js', function () {

	                                    data = Highcharts.geojson(Highcharts.maps[mapKey+name_file]);

	                                    // Hide loading and add series
	                                    chart.hideLoading();
	                                    clearTimeout(fail);
	                                    chart.addSeriesAsDrilldown(e.point, {
	                                        name: e.point.name,
	                                        data: data,
	                                        dataLabels: {
	                                            enabled: false
	                                        }
	                                    });
	                                });
	                            }


	                            this.setTitle(null, { text: e.point.name });
	                        },
	                        drillup: function () {
	                            this.setTitle(null, { text: 'France' });							
	                        }
	                    }
	                },

	                title : {
	                    text : ''
	                },
	                credits : {enabled : false},


	                legend: {
	                    enabled : false
	                },
					tooltip: {
					    formatter: function() {
					        return this.point.name;
					    }
					},

	                mapNavigation: {
	                    enabled: false
	                },

	                plotOptions:{
	                    series:{
	                        point:{
	                            events:{
	                                click: function(){
	                                	chart_1 = $('#section5_carte_1').highcharts();
	                                	chart_1.setTitle(null, {text:this.name});
	                                	nom_1 = this.name;
	                                	value_1 = this.value;
	                                	console.log("change 1");
	                                    displayMapDataviz1(this.value, this.name);
	                                }
	                            }
	                        }
	                    }
	                },        
	                loading: {
	                    style: {
	                        backgroundColor: 'transparent'
	                    }
	                },

	                series : [{
	                    data : data,
	                    name: '',
	                    dataLabels: {
	                        enabled: false
	                    }
	                }],    

	                drilldown: {
	                    //series: drilldownSeries,
	                    activeDataLabelStyle: {
	                        color: '#FFFFFF',
	                        textDecoration: 'none',
	                        textShadow: '0 0 3px #000000'
	                    },
	                    drillUpButton: {
	                        relativeTo: 'spacingBox',
	                        position: {
	                            x: 15,
	                            y: 10
	                        }
	                    }
	                }
	            });

	            $('#section5_carte_2').highcharts('Map', {
	                chart : {
	                    backgroundColor: null,
	                    events: {
	                        drilldown: function (e) {
	                            if (!e.seriesOptions) {
	                                var chart = this,
	                                    mapKey = 'countries/fr/',
	                                    name_file = e.point.drilldown + '-all';


	                                    // Handle error, the timeout is cleared on success
	                                    var fail = setTimeout(function () {
	                                        if (!Highcharts.maps[mapKey]) {
	                                            chart.showLoading('<i class="icon-frown"></i> Failed loading ' + e.point.name);

	                                            fail = setTimeout(function () {
	                                                chart.hideLoading();
	                                            }, 1000);
	                                        }
	                                    }, 3000);
	                                    
	                                // Show the spinner
	                                chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

	                                // Load the drilldown map
	                                $.getScript('js/lib_dept/' + name_file + '.js', function () {

	                                    data = Highcharts.geojson(Highcharts.maps[mapKey+name_file]);

	                                    // Hide loading and add series
	                                    chart.hideLoading();
	                                    clearTimeout(fail);
	                                    chart.addSeriesAsDrilldown(e.point, {
	                                        name: e.point.name,
	                                        data: data,
	                                        dataLabels: {
	                                            enabled: false
	                                        }
	                                    });
	                                });
	                            }


	                            this.setTitle(null, { text: e.point.name });
	                        },
	                        drillup: function () {
	                            this.setTitle(null, { text: 'France' });						
	                        }
	                    }
	                },

	                title : {
	                    text : ''
	                },

	                credits : {enabled : false},


	                legend: {
	                    enabled : false
	                },
					tooltip: {
					    formatter: function() {
					        return this.point.name;
					    }
					},

	                mapNavigation: {
	                    enabled: false
	                },

	                plotOptions:{
	                    series:{
	                        point:{
	                            events:{
	                                click: function(){
										chart_2 = $('#section5_carte_2').highcharts();
	                                	chart_2.setTitle(null, {text:this.name});
	                                	nom_2 = this.name;
	                                	value_2 = this.value;

	                                	console.log("change 2");
	                                    displayMapDataviz2(this.value, this.name);
	                                }
	                            }
	                        }
	                    }
	                },        
	                loading: {
	                    style: {
	                        backgroundColor: 'transparent'
	                    }
	                },

	                series : [{
	                    data : data,
	                    name: '',
	                    dataLabels: {
	                        enabled: false
	                    }
	                }],    

	                drilldown: {
	                    //series: drilldownSeries,
	                    activeDataLabelStyle: {
	                        color: '#FFFFFF',
	                        textDecoration: 'none',
	                        textShadow: '0 0 3px #000000'
	                    },
	                    drillUpButton: {
	                        relativeTo: 'spacingBox',
	                        position: {
	                            x: 15,
	                            y: 10
	                        }
	                    }
	                }
	            });

	   }

    function displayMapDataviz1(value, name){

    	var dataEntree = null;
    	var dataRME = null;
    	var dataIndice = null;

    	console.log(name);

        if(value <100 ){

			$.when(
			    $.getJSON("./json/region_entree_map.json", function(data) {
			        dataEntree = data;
			    }),
			    $.getJSON("./json/region_rme_map.json", function(data) {
			        dataRME = data;
			    }),		    
			    $.getJSON("./json/region_indice_map.json", function(data) {
			        dataIndice = data;
			    })
			).then(function() {
			    if (dataEntree != null && dataRME != null && dataIndice != null) {
			        $.each(dataEntree, function( key, nom ) {
			        	if(name.localeCompare(nom['VILLE']) == 0){

							$.each(dataEntree[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									console.log(annee);
									$("#section5_dataviz1_ville1").html("");
									$("#section5_dataviz1_ville1").append("<p class='map_viz'>"+number_format(val.toFixed(0), 0, ',', ' ')+"</p>");
								}
							});				        		
			        	}
			        });
			        $.each(dataRME, function( key, nom ) {
			        	if(name.localeCompare(nom['VILLE']) == 0){
							$.each(dataRME[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz2_ville1").html("");
									$("#section5_dataviz2_ville1").append("<p class='map_viz'>"+val.toFixed(2)+" €</p>");
								}
							});				        		
			        	}
			        });
			        $.each(dataIndice, function( key, nom ) {
			        	if(name.localeCompare(nom['VILLE']) == 0){
							$.each(dataIndice[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz3_ville1").html("");
									$("#section5_dataviz3_ville1").append("<p class='map_viz'>"+val.toFixed(2)+"</p>");
								}
							});				        		
			        	}
			        });		    	

			    }
			    else {
			        alert("error datat");
			    }
			});

        }
        else{
			$.when(
			    $.getJSON("./json/depart_entree_map.json", function(data) {
			        dataEntree = data;
			    }),
			    $.getJSON("./json/depart_rme_map.json", function(data) {
			        dataRME = data;
			    }),		    
			    $.getJSON("./json/depart_indice_map.json", function(data) {
			        dataIndice = data;
			    })
			).then(function() {
			    if (dataEntree != null && dataRME != null && dataIndice != null) {

			        $.each(dataEntree, function( key, nom ) {

			        	if(name.localeCompare(nom['Ville']) == 0){

							$.each(dataEntree[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz1_ville1").html("");
									$("#section5_dataviz1_ville1").append("<p class='map_viz'>"+number_format(val.toFixed(0), 0, ',', ' ')+"</p>");
								}
							});				        		
			        	}
			        });
			        $.each(dataRME, function( key, nom ) {
			        	if(name.localeCompare(nom['Ville']) == 0){
							$.each(dataRME[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz2_ville1").html("");
									$("#section5_dataviz2_ville1").append("<p class='map_viz'>"+val.toFixed(2)+" €</p>");
								}
							});				        		
			        	}
			        });
			        $.each(dataIndice, function( key, nom ) {
			        	if(name.localeCompare(nom['Ville']) == 0){
							$.each(dataIndice[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz3_ville1").html("");
									$("#section5_dataviz3_ville1").append("<p class='map_viz'>"+val.toFixed(2)+"</p>");
								}
							});				        		
			        	}
			        });		    	

			    }
			    else {
			        alert("error data ");
			    }
			});
        }
    }
    function displayMapDataviz2(value, name){

    	var dataEntree = null;
    	var dataRME = null;
    	var dataIndice = null;

        if(value <100 ){

			$.when(
			    $.getJSON("./json/region_entree_map.json", function(data) {
			        dataEntree = data;
			    }),
			    $.getJSON("./json/region_rme_map.json", function(data) {
			        dataRME = data;
			    }),		    
			    $.getJSON("./json/region_indice_map.json", function(data) {
			        dataIndice = data;
			    })
			).then(function() {
			    if (dataEntree != null && dataRME != null && dataIndice != null) {

			        $.each(dataEntree, function( key, nom ) {
			        	if(name.localeCompare(nom['VILLE']) == 0){

							$.each(dataEntree[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz1_ville2").html("");
									$("#section5_dataviz1_ville2").append("<p class='map_viz'>"+number_format(val.toFixed(0), 0, ',', ' ')+"</p>");
								}
							});				        		
			        	}
			        });
			        $.each(dataRME, function( key, nom ) {
			        	if(name.localeCompare(nom['VILLE']) == 0){
							$.each(dataRME[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz2_ville2").html("");
									$("#section5_dataviz2_ville2").append("<p class='map_viz'>"+val.toFixed(2)+" €</p>");
								}
							});				        		
			        	}
			        });
			        $.each(dataIndice, function( key, nom ) {
			        	if(name.localeCompare(nom['VILLE']) == 0){
							$.each(dataIndice[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz3_ville2").html("");
									$("#section5_dataviz3_ville2").append("<p class='map_viz'>"+val.toFixed(2)+"</p>");
								}
							});				        		
			        	}
			        });		    	

			    }
			    else {
			        alert("error datat");
			    }
			});

        }
        else{
			$.when(
			    $.getJSON("./json/depart_entree_map.json", function(data) {
			        dataEntree = data;
			    }),
			    $.getJSON("./json/depart_rme_map.json", function(data) {
			        dataRME = data;
			    }),		    
			    $.getJSON("./json/depart_indice_map.json", function(data) {
			        dataIndice = data;
			    })
			).then(function() {
			    if (dataEntree != null && dataRME != null && dataIndice != null) {

			        $.each(dataEntree, function( key, nom ) {

			        	if(name.localeCompare(nom['Ville']) == 0){

							$.each(dataEntree[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz1_ville2").html("");
									$("#section5_dataviz1_ville2").append("<p class='map_viz'>"+number_format(val.toFixed(0), 0, ',', ' ')+"</p>");
								}
							});				        		
			        	}
			        });
			        $.each(dataRME, function( key, nom ) {
			        	if(name.localeCompare(nom['Ville']) == 0){
							$.each(dataRME[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz2_ville2").html("");
									$("#section5_dataviz2_ville2").append("<p class='map_viz'>"+val.toFixed(2)+" €</p>");
								}
							});				        		
			        	}
			        });
			        $.each(dataIndice, function( key, nom ) {
			        	if(name.localeCompare(nom['Ville']) == 0){
							$.each(dataIndice[key], function( annee, val ) {
								if(annee == $( "#slider-range-max" ).slider( "value" )){
									$("#section5_dataviz3_ville2").html("");
									$("#section5_dataviz3_ville2").append("<p class='map_viz'>"+val.toFixed(2)+"</p>");
								}
							});				        		
			        	}
			        });		    	

			    }
			    else {
			        alert("error datat");
			    }
			});
        }
    }    

    $( "#slider-range-max" ).slider({
      range: "max",
      min: 1966,
      max: 2014,
      value: 2014,
      slide: function( event, ui ) {
        $( "#data_annee" ).val( ui.value );
        if(nom_1 != null){
        	displayMapDataviz1(value_1, nom_1);
        }
        if(nom_2 != null){
        	displayMapDataviz2(value_2, nom_2);
        }        
      }
    });
    
    $( "#data_annee" ).val( $( "#slider-range-max" ).slider( "value" ) );  
});