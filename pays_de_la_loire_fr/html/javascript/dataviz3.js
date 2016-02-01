'use strict';

var stopI3 = false;

$(document).ready(function() {
      
	var trotteuse = document.getElementById("trotteuse");
	

	//$(trotteuse).css({ transformOrigin: '74.3% 10%' });
		
	var eolienne1_i3 = document.getElementById("eolienne1_i3");
	var eolienne2_i3 = document.getElementById("eolienne2_i3");
	
	//initI3();
});

function initI3(){

	stopI3 = false;
	animTrotteuse(1);
	animEoliennesI3_1();
	animEoliennesI3_2();
}

function stopAnims(){
	stopI3 = true;
}


function animTrotteuse(time) {
		var rot = time * 6;
		$(trotteuse)
		.transition({
					opacity: 1,
					rotate: rot+'deg'
					}, 1000, 'cubic-bezier(0.64,0.57,0.67,1.53)',
					function(){
						if(stopI3) { return;}
						var rot = time * 6;
						$(trotteuse).css({ rotate: rot+'deg'});
						animTrotteuse(++time);
					});

	}


function animEoliennesI3_1() {
	$(eolienne1_i3)
	.transition({
				opacity: 1,
				rotate: 360*rand(1,6)+'deg'
				}, 7000, 'linear',
				function(){
					if(stopI3) { return;}
					$(eolienne1_i3).css({ rotate: '0deg'});
					animEoliennesI3_1();
				});
}

function animEoliennesI3_2() {
	$(eolienne2_i3)
	.transition({
				opacity: 1,
				rotate: 360*rand(1,4)+'deg'
				}, 5000, 'linear',
				function(){
					if(stopI3) { return;}
					$(eolienne2_i3).css({ rotate: '0deg'});
					animEoliennesI3_2();
				});
}


function rand(min,max){
	return(Math.round((Math.random()*(max-min))+min));
}


