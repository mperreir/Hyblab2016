var sidebar = $("#interview-page").find(".sidebar");
var content = sidebar.find(".content");
var done = false;

$("#interview-page")
  .find(".sidebar")
  .on("click", function() {
    if (!done) {
      content.find(".item").each(function(idx) {
        $(this).delay(idx * 2000).fadeIn("slow");
      });
    }
    done = true;
  });
