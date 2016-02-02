'use strict';

var stopI3 = false;

$(document).ready(function() {
      
	//init3();
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


function init3() {
	var line1 = document.getElementById("line_data3_1");
    
	
	reset3();
	animEolienne3_1();
	
	line1.classList.remove("draw_line1");
  	setTimeout(function(){line1.classList.add("draw_line1");},1);
  	line1.style.display = "block";

  }

function reset3() {

	$(eolienne_mat1_3).css({top:'100%'});
	$(eolienne_pale1_3).css({top:'100%'});
	$(eolienne_mat2_3).css({top:'80%'});
	$(eolienne_pale2_3).css({top:'80%'});
	$(eolienne_mat3_3).css({top:'80%'});
	$(eolienne_pale3_3).css({top:'80%'});
	$(eolienne_mat4_3).css({top:'80%'});
	$(eolienne_pale4_3).css({top:'80%'});
	$(eolienne_mat5_3).css({top:'80%'});
	$(eolienne_pale5_3).css({top:'80%'});
	var line1 = document.getElementById("line_data3_1");
	line1.style.display = "none";
	var line2 = document.getElementById("line_data3_2");
	line2.style.display = "none";
}

function animEolienne3_1(){
	$(eolienne_mat1_3)
	.transition({
				opacity: 1,
				top:'53.5%'
				}, 1000, 'easeOutCubic');

	$(eolienne_pale1_3)
	.transition({
				opacity: 1,
				top:'41.5%'
				}, 1000, 'easeOutCubic',function(){
					animEolienne3_2();
				});
}

function animEolienne3_2(){
	$(eolienne_mat2_3)
	.transition({
				opacity: 1,
				top:'44.5%'
				}, 1000, 'easeOutCubic');

	$(eolienne_pale2_3)
	.transition({
				opacity: 1,
				top:'30%'
				}, 1000, 'easeOutCubic',function(){
					animEolienne3_3();
				});
}

function animEolienne3_3(){
	$(eolienne_mat3_3)
	.transition({
				opacity: 1,
				top:'34.5%'
				}, 1000, 'easeOutCubic');

	$(eolienne_pale3_3)
	.transition({
				opacity: 1,
				top:'19.5%'
				}, 1000, 'easeOutCubic',function(){
					animEolienne3_4();
					var line2 = document.getElementById("line_data3_2");
  					line2.style.display = "block";
				});
}

function animEolienne3_4(){
	$(eolienne_mat4_3)
	.transition({
				opacity: 1,
				top:'19.5%'
				}, 1000, 'easeOutCubic');

	$(eolienne_pale4_3)
	.transition({
				opacity: 1,
				top:'13.5%'
				}, 1000, 'easeOutCubic',function(){
					animEolienne3_5();
				});
}

function animEolienne3_5(){
	$(eolienne_mat5_3)
	.transition({
				opacity: 1,
				top:'12.5%'
				}, 1000, 'easeOutCubic');

	$(eolienne_pale5_3)
	.transition({
				opacity: 1,
				top:'8.5%'
				}, 1000, 'easeOutCubic');
}

function rand(min,max){
	return(Math.round((Math.random()*(max-min))+min));
}


