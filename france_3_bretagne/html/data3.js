"use strict"

$(document).ready(function() {


	$(".fancybox-thumbs").fancybox({
		padding: 0,
		prevEffect : 'none',
		nextEffect : 'none',
		closeBtn  : true,
		arrows    : true,
		helpers: {
			title : {
				type : 'outside'
			},
			overlay : {
				speedOut : 0
			}
		}
	});
	
	
	//1
	$("#cercle1").mouseover(function(){
		$("#cercle1").css({
			r : "126px",
			cx : "133px",
			cy : '136px'
		});
		$("#insolite1").css({
			width : "265px",
			height : "265px"
		});
		$("#cache1").css({
			opacity : 0.15
		});
		$("#ctitre1").css({
			opacity : 1,
			top : "415px",
			left : "115px",
			"font-size" : "23pt"
		});
				
	});

	$("#cercle1").mouseout(function(){
		$("#cercle1").css({
			r : '120px',
			cx : "124px",
			cy : '129px'
		});
		$("#insolite1").css({
			width : "247px",
			height : "251px"
		});
		$("#cache1").css({
			opacity : 0
		});
		$("#ctitre1").css({
			opacity : 0,
			top : "365px",
			left : "165px",
			"font-size" : "15pt"
		});
	});

	//2
	$("#cercle2").mouseover(function(){
		$("#cercle2").css({
			r : "128px",
			cx : "133px",
			cy : '132px',
		});
		$("#insolite2").css({
			width : "265px",
			height : "265px"
		});
		$("#cache2").css({
			opacity : 0.15
		});
		$("#ctitre2").css({
			opacity : 1,
			top : "415px",
			left : "470px",
			"font-size" : "23pt"
		});
	});

	$("#cercle2").mouseout(function(){
		$("#cercle2").css({
			r : '120px',
			cx : "123px",
			cy : '124px'
		});
		$("#insolite2").css({
			width : "247px",
			height : "251px"
		});
		$("#cache2").css({
			opacity : 0,

		});
		$("#ctitre2").css({
			opacity : 0,
			top : "365px",
			left : "495px",
			"font-size" : "15pt"
		});
	});

	//3
	$("#cercle3").mouseover(function(){
		$("#cercle3").css({
			r : "128px",
			cx : "131px",
			cy : '136px'
		});
		$("#insolite3").css({
			width : "265px",
			height : "265px"
		});
		$("#cache3").css({
			opacity : 0.15
		});
		$("#ctitre3").css({
			opacity : 1,
			top : "415px",
			left : "790px",
			"font-size" : "23pt"
		});
	});

	$("#cercle3").mouseout(function(){
		$("#cercle3").css({
			r : '120px',
			cx : "122px",
			cy : '129px'
		});
		$("#insolite3").css({
			width : "247px",
			height : "251px"
		});
		$("#cache3").css({
			opacity : 0
		});
		$("#ctitre3").css({
			opacity : 0,
			top : "365px",
			left : "825px",
			"font-size" : "15pt"
		});
	});

	//4
	$("#cercle4").mouseover(function(){
		$("#cercle4").css({
			r : "128px",
			cx : "133px",
			cy : '133px'
		});
		$("#insolite4").css({
			width : "265px",
			height : "265px"
		});
		$("#cache4").css({
			opacity : 0.15
		});
		$("#ctitre4").css({
			opacity : 1,
			top : "745px",
			left : "125px",
			"font-size" : "23pt"
		});
	});

	$("#cercle4").mouseout(function(){
		$("#cercle4").css({
			r : '120px',
			cx : "124px",
			cy : '123px'
		});
		$("#insolite4").css({
			width : "247px",
			height : "251px"
		});
		$("#cache4").css({
			opacity : 0
		});
		$("#ctitre4").css({
			opacity : 0,
			top : "695px",
			left : "165px",
			"font-size" : "15pt"
		});
	});

	//5
	$("#cercle5").mouseover(function(){
		$("#cercle5").css({
			r : "128px",
			cx : "133px",
			cy : '131px'
		});
		$("#insolite5").css({
			width : "265px",
			height : "265px"
		});
		$("#cache5").css({
			opacity : 0.15
		});
		$("#ctitre5").css({
			opacity : 1,
			top : "745px",
			left : "520px",
			"font-size" : "23pt"
		});
	});

	$("#cercle5").mouseout(function(){
		$("#cercle5").css({
			r : '120px',
			cx : "124px",
			cy : '124px'
		});
		$("#insolite5").css({
			width : "247px",
			height : "251px"
		});
		$("#cache5").css({
			opacity : 0
		});
		$("#ctitre5").css({
			opacity : 0,
			top : "695px",
			left : "535px",
			"font-size" : "15pt"
		});
	});

	//6
	$("#cercle6").mouseover(function(){
		$("#cercle6").css({
			r : "128px",
			cx : "133px",
			cy : '161px'
		});
		$("#insolite6").css({
			width : "266px",
			height : "291px"
		});
		$("#cache6").css({
			opacity : 0.15
		});
		$("#ctitre6").css({
			opacity : 1,
			top : "755px",
			left : "840px",
			"font-size" : "23pt"
		});
	});

	$("#cercle6").mouseout(function(){
		$("#cercle6").css({
			r : '120px',
			cx : "124px",
			cy : '149px'
		});
		$("#insolite6").css({
			width : "246px",
			height : "271px"
		});
		$("#cache6").css({
			opacity : 0
		});
		$("#ctitre6").css({
			opacity : 0,
			top : "710px",
			left : "850px",
			"font-size" : "15pt"
		});
	});

});