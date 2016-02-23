"use strict";
$(function () {
    $('#chart_section5_2').highcharts({
		chart: {
		 backgroundColor: null
  		},
        credits : {enabled:false},
        title: {
            text: 'Entrées',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: CNC',
            x: -20
        },
        xAxis: {
            categories: ['1960','1961','1962','1963','1964','1965','1966','1967','1968','1969','1970','1971','1972','1973','1974','1975','1976','1977','1978','1979','1980','1981','1982','1983','1984','1985','1986','1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014'],
            labels: {
                style: {
                    color: '#000'
                }
            }

        },
        yAxis: {
            title: {
                text: 'Entrées (M)',
                style: {
                    color: '#000'
                }
            },
            labels: {
                style: {
                    color: '#000'
                }
            },
            plotLines: [{
                value: 0,
                width: 1,
                color:'#000',
            }]
        },
        tooltip: {
            valueSuffix: 'Millions'
        },
		exporting :{ enabled:false},
		credits :{ enabled:false},
        legend: {
            enabled:false
        },
        plotOptions: {
            series: {
                allowPointSelect: false,
                color : "#F2705B",
                point:{
                    events:{
                        mouseOver: function(){
                           setContext(this.category);
                        }
                    }
                }
            },            
        },
        series: [
        {
            name: 'Entrées',
            data: [354.6,328.3,311.7,{y: 291.2, color: '#3d4452',name: "Création de la télé"},275.8,259.1,{y: 234.2, color: '#3d4452', name:"Sortie de La Grande Vadrouille"},211.5,203.2,{y: 183.9, color: '#3d4452', name: "Sortie de Il était une fois dans l'ouest"},184.4,177.0,184.4,{y: 176.0, color: '#3d4452', name: "Choc pétrolier"},179.4,181.7,177.3,170.3,178.5,{y: 178.1, color: '#3d4452', name:"Choc pétrolier"},175.4,189.2,201.9,198.9,{y: 190.9, color: '#3d4452', name:"Création de Canal"},175.1,{y: 168.1, color: '#3d4452', name:"Création de la 5"},{y: 136.9, color: '#3d4452', name:"Création de M6"},124.7,120.9,121.9,117.5,116.0,{y: 137.7, color: '#3d4452', name:"Construction du 1er Multiplex"},124.4,130.2,136.7,{y: 149.3, color: '#3d4452', name:"Sortie de Titanic"},170.6,153.6,{y: 165.8, color: '#3d4452', name : "Bulle Internet"},187.5,184.4,173.5,195.8,{y: 175.6, color: '#3d4452', name: "Apparition de la TNT"},188.8,178.5,{y: 190.3, color: '#3d4452', name:"Sortie de Bienvenue chez les Ch'tis"},{y: 201.6, color: '#3d4452', name:"Crise financière"},207.1,{y: 217.2, color: '#3d4452', name:"Sortie de Intouchables"},203.6,193.7,209.0]
        }]
    });

    var chart = $('#ecran_section5_2').highcharts();
    var i =0;
    var response = null;

    function setContext(year){
        $.getJSON( "./json/dataviz2.json", function() {
            console.log( "success dataviz2" );
        })
        .done(function(data) {
            response = data;

            if(response != null){
                $.each(response[0], function( annee, lien_img ) {
                    if(annee == parseInt(year)){
                        $("#ecran_section5_2_back").css('display','inherit');
                        $("#ecran_section5_2_back").attr("src","img/"+lien_img);    
                    }
                });            
            }

           
        });
    }


});