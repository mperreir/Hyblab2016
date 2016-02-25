"use strict";
var testeuh;
var plateforme = [
	{name: 'Wiseed', Immobilier:16040000, Santé: 4010000, Cleantech: 6015000, Service_web: 3208000, 
			Economie_collaborative: 401000, Mode: 401000, Objets_connectés: 1203000, Services_numériques: 2005000,
			Foodtech: 2005000, Autre:4812000},
				
	{name: 'Anaxago', Immobilier:15385704, Santé: 5883249, Cleantech: 2783400, Service_web: 4843104, E_commerce: 2103007, 
			Economie_collaborative: 2599680, Mode: 855971, Objets_connectés: 507334, Services_numériques: 624934, Foodtech: 2003756},
				
	{name: 'Sowefund',Cleantech: 273875, Service_web: 737654, Mode: 55500, Objets_connectés: 393003, Foodtech: 550448, 
				Service_personne: 373497},

	{name: 'HappyCapital', Immobilier:67757, Santé: 1246064, Cleantech: 149606, Service_web: 46995, Mode: 320000, Foodtech: 116604},
				
	{name: 'ABFunding', Cleantech: 510240, E_commerce: 259300, Mode: 335208, Foodtech: 187250},
				
	{name: 'SmartAngels',Santé: 1473290, Cleantech: 3406216, Service_web: 1738283, E_commerce: 300000, Mode: 2781563,
		Objets_connectés: 671286, Foodtech: 1013075, Service_personne: 1022508, Service_entreprise: 1608500, Autre:500775},
				
	{name: 'BulbInTown', Cleantech: 1000000, Mode: 356510, Foodtech: 730580, Service_entreprise: 289680},
				
	{name: 'MyNewStartUp', Economie_collaborative: 1000560, Service_entreprise: 400185},
				
	{name: 'Letitseed', Cleantech: 950000, Service_personne: 220250},
				
	{name: 'Proximea', Cleantech: 969600, Foodtech: 847182},
				
	{name: 'Raizers', Immobilier:565276, Cleantech: 150255, Mode: 89000, Foodtech: 255000},
]

var secteur = [ 
	{name: 'Immobilier', Wiseed: 16040000, Anaxago: 15385704, HappyCapital: 67757, Raizers: 565276 },
	
	{name: 'Santé', Wiseed: 4010000, Anaxago: 5883249, HappyCapital: 1246064, SmartAngels: 1473290 },
	
	{name: 'Cleantech', Wiseed: 6015000, Anaxago: 2783400, Sowefund: 273875, HappyCapital: 149606, ABFunding: 510240, 
		SmartAngels: 3406216, BulbInTown: 1000000, Letitseed: 950000, Proximea: 969600, Raizers: 150255 },
		
	{name: 'Service_web', Wiseed: 3208000, Anaxago: 4843104, Sowefund: 737654, HappyCapital: 46995, SmartAngels: 1738283 },
	
	{name: 'Economie_collaborative', Wiseed: 401000, Anaxago: 2599680, MyNewStartUp: 1000560 },
 
	{name: 'Mode', Wiseed: 401000, Anaxago: 855971, Sowefund: 55500, HappyCapital: 320000, ABFunding: 335208,
		SmartAngels: 2781563, BulbInTown: 356510, Raizers: 89000 },
		
	{name: 'Objets_connectés', Wiseed: 1203000, Anaxago: 507334, Sowefund: 393003, SmartAngels: 671286 },
	
	{name: 'Services_numériques', Wiseed: 2005000, Anaxago: 624934 },
  
	{name: 'Foodtech', Wiseed: 2005000, Anaxago: 2003756, Sowefund: 550448, HappyCapital: 116604, ABFunding: 187250,
		SmartAngels: 1013075, BulbInTown: 730580, Proximea: 847182, Raizers: 255000 },
	
	{name: 'E_commerce', Anaxago: 2103007, ABFunding: 259300, SmartAngels: 300000 },
	
	{name: 'Service_personne',  Sowefund: 373497, SmartAngels: 1022508, Letitseed: 220250 },
   
	{name: 'Service_entreprise', SmartAngels: 1608500, BulbInTown: 289680, MyNewStartUp: 400185 },
	
	{name: 'Autre', Wiseed:4812000, SmartAngels: 500775} 
]

var maxWidth = 600;
var maxHeight = 800;
var outerRadius = 150;
var ringWidth = 100;
var label = 230;

// This function helps you figure out when all
// the elements have finished transitioning
// Reference: https://groups.google.com/d/msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
function checkEndAll(transition, callback) {
    var n = 0;
    transition
    .each(function() { ++n; })
    .each("end", function() {
        if (!--n) callback.apply(this, arguments);
    });
}    

function drawAnimatedRingChart(config) {

    var pie = d3.layout.pie().value(function (d) { 	
		if (d[config.selected]==undefined)
			return null;
		else
			return d[config.selected];
    })
	.sort(null);
	
    var color = d3.scale.ordinal()
	.range(["#D0AA71","#879BA8","#E6D9C2","#0B2D43","#D8D3CB","#0D2131","#CC9E53","#99A9B4","#DDB580","#113D56","#B17E49","#D8D3CB","#0D2131"]);

    var arc = d3.svg.arc();

    // This function helps transition between
    // a starting point and an ending point
    // Also see: http://jsfiddle.net/Nw62g/3/
    function tweenPie(finish) {
        var start = {
                startAngle: 0,
                endAngle: 0
            };
        var i = d3.interpolate(start, finish);
        return function(d) { return arc(i(d)); };
    }
    arc.outerRadius(config.outerRadius || outerRadius)
        .innerRadius(config.innerRadius || innerRadius);

    // Remove the previous ring
    d3.select(config.el).selectAll('g').remove();
    d3.select(config.el).selectAll('text').remove();

    var svg = d3.select(config.el)
        .attr({
            width: maxWidth,
            height: maxHeight,
			preserveAspectRatio: "xMidYMid meet",
            viewBox: "0 0 " + maxWidth + " " + maxHeight
        })
		
	svg.append('text')
	.attr({
		'font-size': 48,
		'color':'black',
		'text-anchor': 'middle',
		'transform': 'translate(' + (maxWidth/2) + ',' + 50 + ')'
	})
	.text(config.selected)
		
    // Add the groups that will hold the arcs
    var groups = svg.selectAll('g.arc')
    .data(pie(config.data))
    .enter()
    .append('g')
    .attr({
        'class': 'arc',
        'transform': 'translate(' + (10+maxWidth/2) + ', ' + (maxHeight/2) + ')'
    })
	.on("mouseenter", function(d){
		if(config.el=='#animated-ring'){
			drawAnimatedRingChart({
				el: '#animated-ring2',
				selected: d.data.name,
				outerRadius: outerRadius,
				innerRadius: outerRadius - ringWidth,
				data: plateforme
			});
			adjustSelect("selPlat2",d.data.name);
		}
		else{
			drawAnimatedRingChart({
				el: '#animated-ring',
				selected: d.data.name,
				outerRadius: outerRadius,
				innerRadius: outerRadius - ringWidth,
				data: secteur
			});
			adjustSelect("selPlat",d.data.name);
		}
	})
	.on("mouseover", function(){
		d3.select(config.el).selectAll('path').attr('opacity',0.25);
		d3.select(config.el).selectAll('text').attr('opacity',0.25);
		d3.select(this).select('path').attr('opacity',1);
		d3.select(this).select('text').attr('opacity',1);
	})
	.on("mouseout", function(){
		d3.selectAll('arc').selectAll('path').attr('opacity',1) 	
		d3.selectAll('arc').selectAll('text').attr('opacity',1) 	
	})

    // Create the actual slices of the pie
    groups.append('path')
    .attr({
        'fill': function (d, i) {
            return color(i);
        }
    })
    .transition()
    .duration(config.duration || 500)
    .attrTween('d', tweenPie)
    .call(checkEndAll, function () {
        
        // Finally append the title of the text to the node
        groups.append('text')
		.attr({
			'text-anchor': 'middle',
			"transform" : function(d) {	
				var c = arc.centroid(d),
					x = c[0],
					y = c[1],
					// pythagorean theorem for hypotenuse
					h = Math.sqrt(x*x + y*y);
				return "translate(" + (x/h * label) +  ',' +
				   (y/h * label) +  ")"; 
			}	
		})
        .text(function (d) {
            // Notice the usage of d.data to access the raw data item
			if (d.data[config.selected]!=undefined)
				if((d.endAngle-d.startAngle)>0.2){
					return d.data.name.replace('_',' ');;
				}
				else 
					return null;
			else 
				return null;
        })
		.attr('font-size','24');
    });
}

// Render the initial ring
drawAnimatedRingChart({
    el: '#animated-ring',
	selected: "Wiseed",
    outerRadius: outerRadius,
    innerRadius: outerRadius - ringWidth,
    data: secteur
});

// Render the initial ring
drawAnimatedRingChart({
    el: '#animated-ring2',
	selected: "Immobilier",
    outerRadius: outerRadius,
    innerRadius: outerRadius - ringWidth,
    data: plateforme
});

//Listen to changes on the select element
document.querySelector('#selPlat')
	.addEventListener('change', function (e) {
		drawAnimatedRingChart({
			el: '#animated-ring',
			selected: this.value,
			outerRadius: outerRadius,
			innerRadius: outerRadius - ringWidth,
			data: secteur
		});
		document.getElementById('title1').innerHTML = this.value;
	});

document.querySelector('#selPlat2')
	.addEventListener('change', function (e) {
		drawAnimatedRingChart({
			el: '#animated-ring2',
			selected: this.value,
			outerRadius: outerRadius,
			innerRadius: outerRadius - ringWidth,
			data: plateforme
		});
		document.getElementById('title2').innerHTML = this.value;
	});	

function adjustSelect(sel,optionSel){
	var opt = document.getElementById(sel).getElementsByTagName('option');
	for(var i=0; i<opt.length; i++){
		if(opt[i].value==optionSel)
			opt[i].selected='selected';
	}	
}