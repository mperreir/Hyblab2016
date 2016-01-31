'use strict';

$(document).ready(function() {
      
	var s = Snap.select('#svg_i3');
	var g = s.group();
	/*var trotteuse = s.select("#trotteuse");*/
	g.image("svg/aiguille-horloge.svg",0,0,200,200, function(loadedFragment) {
                                                g.append(loadedFragment);
                                                /*g.hover(hoverover, hoverout);*/
                                        });

	animTrotteuse(6);
	function animTrotteuse(time){
		var rot = time * 6;
		g.stop().animate({ transform: 'r'+rot+', 160, 25'},
		1000,mina.bounce,
		function(){
			var rot = time * 6;
			g.attr({ transform: 'rotate('+rot+' 160 25)'});
			animTrotteuse(++time);
		});
	}

	
});
