$(document).ready(function() {
  //current menu (to know where we are from clicking on menus' elements)
  var currentNav=0;
  var currentTab=0;

  var animationTypes = []


  //Different IDs of the div we're displaying / hiding in jQuery
  var arr = ['#ca_pousse_edito', '#ca_pousse_sondage', '#ca_pousse_photos',
             '#eclosions_edito', '#eclosions_sondage', '#eclosions_photos',
             '#quartiers_edito', '#quartiers_sondage', '#quartiers_photos'];

  var tabs = ["#submenu1", "#submenu2", "#submenu3"];

  //Initialization of the page
  for(var i=0; i < 9; i++){
    $(arr[i]).hide();
  }
  $(arr[0]).show("slow");

  // Events handling
  $("#menu1").click( function() {
    console.log('clic menu1');

    switch(currentNav){
      case 0:
        $("#menu1").removeClass("active");
        $(this).addClass("active");
        break;
      case 1:
        $("#menu2").removeClass("active");
        $(this).addClass("active");
        break;
      case 2:
        $("#menu3").removeClass("active");
        $(this).addClass("active");
        break;
    }

    currentNav = 0;
    for(var i=0; i < 9; i++){
      $(arr[i]).hide();
    }
    $("#ca_pousse_edito").show("slow");
    $(tabs[currentTab]).removeClass("active");
    currentTab=0;
    $(tabs[currentTab]).addClass("active");
  });

  $("#menu2").click( function() {
    console.log('clic menu2');

    switch(currentNav){
      case 0:
        $("#menu1").removeClass("active");
        $(this).addClass("active");
        break;
      case 1:
        $("#menu2").removeClass("active");
        $(this).addClass("active");
        break;
      case 2:
        $("#menu3").removeClass("active");
        $(this).addClass("active");
        break;
    }

    currentNav = 1;
    for(var i=0; i < 9; i++){
      $(arr[i]).hide();
    }
    $("#eclosions_edito").show("slow");
    $(tabs[currentTab]).removeClass("active");
    currentTab=0;
    $(tabs[currentTab]).addClass("active");
  });

  $("#menu3").click( function() {
    console.log('clic menu3');

    switch(currentNav){
      case 0:
        $("#menu1").removeClass("active");
        $(this).addClass("active");
        break;
      case 1:
        $("#menu2").removeClass("active");
        $(this).addClass("active");
        break;
      case 2:
        $("#menu3").removeClass("active");
        $(this).addClass("active");
        break;
    }

    currentNav = 2;
    for(var i=0; i < 9; i++){
      $(arr[i]).hide();
    }
    $("#quartiers_edito").show("slow");
    $(tabs[currentTab]).removeClass("active");
    currentTab=0;
    $(tabs[currentTab]).addClass("active");
  });




  /* TABS HANDLING */
  $("#submenu1").click( function() {
    console.log('clic submenu1');
    for(var i=0; i < 9; i++){
      $(arr[i]).hide();
    }

    console.log(currentNav);
    switch(currentNav){
      case 0:
        $("#ca_pousse_edito").show("slow");
        $(tabs[currentTab]).removeClass("active");
        $(this).addClass("active");
        break;
      case 1:
        $("#eclosions_edito").show("slow");
        $(tabs[currentTab]).removeClass("active");
        $(this).addClass("active");
        break;
      case 2:
        $("#quartiers_edito").show("slow");
        $(tabs[currentTab]).removeClass("active");
        $(this).addClass("active");
        break;
    }
    currentTab=0;
  });

  $("#submenu2").click( function() {
    console.log('clic submenu2');
    for(var i=0; i < 9; i++){
      $(arr[i]).hide();
    }

    console.log(currentNav);
    switch(currentNav){
      case 0:
        $("#ca_pousse_sondage").show("slow");
        $(tabs[currentTab]).removeClass("active");
        $(this).addClass("active");
        break;
      case 1:
        $("#eclosions_sondage").show("slow");
        $(tabs[currentTab]).removeClass("active");
        $(this).addClass("active");
        break;
      case 2:
        $("#quartiers_sondage").show("slow");
        $(tabs[currentTab]).removeClass("active");
        $(this).addClass("active");
        break;
    }
    currentTab=1;
  });


  $("#submenu3").click( function() {
    console.log('clic submenu3');
    for(var i=0; i < 9; i++){
      $(arr[i]).hide();
    }

    console.log(currentNav);
    switch(currentNav){
      case 0:
        $("#ca_pousse_photos").show("slow");
        $(tabs[currentTab]).removeClass("active");
        $(this).addClass("active");
        break;
      case 1:
        $("#eclosions_photos").show("slow");
        $(tabs[currentTab]).removeClass("active");
        $(this).addClass("active");
        break;
      case 2:
        $("#quartiers_photos").show("slow");
        $(tabs[currentTab]).removeClass("active");
        $(this).addClass("active");
        break;
    }
    currentTab=2;
  });
});
