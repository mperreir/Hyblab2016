//'use strict';

function donut(a,b){
        var width = 460,
            height = 300,
            radius = Math.min(width, height) / 2;
        
        var color = d3.scale.category20();
        
        var pie = d3.layout.pie()
            .sort(null);
        
        var arc = d3.svg.arc()
            .innerRadius(radius - 100)
            .outerRadius(radius - 50);
        
        var data= $.getJSON("./JSON/hyblab.json",function(donnees){
            jQuery.each(donnees, function(){ 
                    var div=d3.select("body").append("div");
                    var x=[this[a],this[b]]; 
                    var pourc=this[a]/this[b];
                    var txt="<b>Pourcentage : </b>" + pourc +" Moy_sp_DOC_region :"+ this[a]+" Moy_sp_TGC :"+this[b]+" x:"+x;
                   div.html(txt);
                    var svg = d3.select("body").append("svg").attr("id",this.Regions)
                        .attr("width", width)
                        .attr("height", height)
                        .append("g")
                        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                        .on("mouseover", function(d) {
                            div.transition().duration(200).style("opacity",0.9);
                            /*var txt="<b>Pourcentage : </b>" + pourc +" Moy_sp_DOC_region :"+ this[a]+" Moy_sp_TGC :"+this[b];
                            div.html(txt)
                            .style("left", (d3.event.pageX + 10) + "px")     
                            .style("top", (d3.event.pageY - 50) + "px");*/
                })
                .on("mouseout", function(d) {
                    div.transition().duration(500).style("opacity", 0);
                });   
                    
                    var donut= svg.selectAll("path")
                        .data(pie(x))
                        .enter().append("path")
                        .attr("fill", function(d, i) { return color(i); })
                        .attr("d", arc);
                } 
            );
        });
}