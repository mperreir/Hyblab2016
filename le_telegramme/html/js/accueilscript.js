$(document).ready( function () {
  if ($(document).width() < 768) {
    $('#container').hide();
    $('#p1_contenu').hide();
    $('#barre_progression').hide();
    $('#demarrer').hide();

<<<<<<< HEAD
=======
  var animate = function () {
    progress.val(progress.val() + progress.attr("max")/time);
    if (progress.val() < 100) {
      setTimeout(animate, 1700)
    }
    else {
      progress.val(progress.attr("max"));
    }
>>>>>>> 29337f985dc5261e600ab41f028201e1c0821da4
  }
  else {
    $("iframe").load("pageAccueil.html");
    var time = 10;
    var inter = 1;
    var progress = $("#barre_progression");

    var animate = function () {
      progress.val(progress.val() + progress.attr("max")/time);
      if (progress.val() < 100) {
        setTimeout(animate, 1500)
      }
      else {
        progress.val(progress.attr("max"));
      }
    }
    setTimeout(animate, 1000);
  }
});
