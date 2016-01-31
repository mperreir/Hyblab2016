'use strict';

$(document).ready(function() {
      
	var trotteuse = document.getElementById("trotteuse");
	

	$(trotteuse).css({ transformOrigin: '74.3% 10%' });
	animTrotteuse(1);

	function animTrotteuse(time) {
		var rot = time * 6;
		$(trotteuse)
		.transition({
					opacity: 1,
					rotate: rot+'deg'
					}, 1000, 'cubic-bezier(0.64,0.57,0.67,1.53)',
					function(){
						var rot = time * 6;
						$(trotteuse).css({ rotate: rot+'deg'});
						animTrotteuse(++time);
					});

	}

	var eolienne1_i3 = document.getElementById("eolienne1_i3");
	var eolienne2_i3 = document.getElementById("eolienne2_i3");

	animEoliennesI3_1();
	function animEoliennesI3_1() {
		$(eolienne1_i3)
		.transition({
					opacity: 1,
					rotate: 360*rand(1,6)+'deg'
					}, 7000, 'linear',
					function(){
						$(eolienne1_i3).css({ rotate: '0deg'});
						animEoliennesI3_1();
					});
	}

	animEoliennesI3_2();
	function animEoliennesI3_2() {
		$(eolienne2_i3)
		.transition({
					opacity: 1,
					rotate: 360*rand(1,4)+'deg'
					}, 5000, 'linear',
					function(){
						$(eolienne2_i3).css({ rotate: '0deg'});
						animEoliennesI3_2();
					});
	}

	

	function rand(min,max){
		return(Math.round((Math.random()*(max-min))+min));
	}

});
