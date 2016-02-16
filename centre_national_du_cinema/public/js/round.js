(function($){

	$('input.round').wrap('<div class="round" />');
	var $input = $('input.round');
	var $div = $input.parent();

	var ratio = $input.val()/100;

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

})(jQuery);