'use strict';

$(document).ready(function() {
      
	var trotteuse = document.getElementById("trotteuse");
	var eolienne1_i3 = document.getElementById("eolienne1_i3");

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


	animEoliennesI3();
	function animEoliennesI3() {
		$(eolienne1_i3)
		.transition({
					opacity: 1,
					rotate: '2610deg'
					}, 5000, 'easeInOutCubic',
					function(){
						$(eolienne1_i3).css({ rotate: '0deg'});
						animEoliennesI3();
					});

	}


	
	
});
