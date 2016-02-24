$(document).ready( function () {
  var time = 10;
  var inter = 1;
  var progress = $("#barre_progression");

  var animate = function () {
    progress.val(progress.val() + progress.attr("max")/time);
    if (progress.val() < 100) {
      setTimeout(animate, 1700)
    }
    else {
      progress.val(progress.attr("max"));
    }
  }
  setTimeout(animate, 1000);

/************************************************************************************/
  $('.js-scrollTo').on('click', function() {
			var page = $(this).attr('href');
			var speed = 1500;
			$('html, body').animate( { scrollTop: $(page).offset().top }, speed ); // Go
			return false;
		});
});
