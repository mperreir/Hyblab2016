"use strict";

$(document).ready(function() {
  //current menu (to know where we are from clicking on menus' elements)
  var currentNav=0;
  var currentTab=0;


  //Different IDs of the div we're displaying / hiding in jQuery
  var arr = ['#ca_pousse_edito', '#ca_pousse_sondage', '#ca_pousse_photos',
             '#eclosions_edito', '#eclosions_sondage', '#eclosions_photos',
             '#quartiers_edito', '#quartiers_sondage', '#quartiers_photos', "#credits"];

  var tabs = ["#submenu1", "#submenu2", "#submenu3"];

  //Initialization of the page
  for(var i=0; i < 10; i++){
    $(arr[i]).hide();
  }
  $(arr[0]).show("slow");

  $("#submenu li").css("border-right", "2px solid #F7931E");

  // Events handling
  $("#menu1").click( function() {
    console.log('clic menu1');
    $("#right iframe").attr("src", "map.html");
    $("#submenu").show("fast");
    $("#submenu li").css("border-right", "2px solid #F7931E");

    switch(currentNav){
      case 0:
        $("#menu1").removeClass("active");
        $(tabs[currentTab]).removeClass("active_j");

        //clean all the tabs
        $("#submenu1").removeClass("noactive_j");
        $("#submenu2").removeClass("noactive_j");
        $("#submenu3").removeClass("noactive_j");
        $(this).addClass("active");
        break;
      case 1:
        $("#menu2").removeClass("active");
        $(tabs[currentTab]).removeClass("active_r");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_r");
        $("#submenu2").removeClass("noactive_r");
        $("#submenu3").removeClass("noactive_r");
        $(this).addClass("active");
        break;
      case 2:
        $("#menu3").removeClass("active");
        $(tabs[currentTab]).removeClass("active_b");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_b");
        $("#submenu2").removeClass("noactive_b");
        $("#submenu3").removeClass("noactive_b");
        $(this).addClass("active");
        break;
      case 3:
        $("#menu4").removeClass("active");
        $(tabs[currentTab]).removeClass("active_b");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_b");
        $("#submenu2").removeClass("noactive_b");
        $("#submenu3").removeClass("noactive_b");
        $(this).addClass("active");
        break;        
    }

    //we update the current tab selected in the main navbar
    currentNav = 0;
    //hiding all the divs
    for(var i=0; i < 10; i++){
      $(arr[i]).hide();
    }

    //displaying the good panel
    $("#ca_pousse_edito").show("slow");

    //applying the active CSS class to the current tab
    currentTab=0;
    $(tabs[currentTab]).addClass("active_j");
    $("#submenu2").addClass("noactive_j");
    $("#submenu3").addClass("noactive_j");

    //changing the color of the tab to the right one
    $("#middle").css("background-color","#F7931E");
  });



  $("#menu2").click( function() {
    console.log('clic menu2');

    $("#right iframe").attr("src", "map2.html");
    $("#submenu").show("fast");
    $("#submenu li").css("border-right", "2px solid #FF605E");

    switch(currentNav){
      case 0:
        $("#menu1").removeClass("active");
        $(tabs[currentTab]).removeClass("active_j");

        //clean all the tabs
        $("#submenu1").removeClass("noactive_j");
        $("#submenu2").removeClass("noactive_j");
        $("#submenu3").removeClass("noactive_j");
        $(this).addClass("active");
        break;
      case 1:
        $("#menu2").removeClass("active");
        $(tabs[currentTab]).removeClass("active_r");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_r");
        $("#submenu2").removeClass("noactive_r");
        $("#submenu3").removeClass("noactive_r");
        $(this).addClass("active");
        break;
      case 2:
        $("#menu3").removeClass("active");
        $(tabs[currentTab]).removeClass("active_b");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_b");
        $("#submenu2").removeClass("noactive_b");
        $("#submenu3").removeClass("noactive_b");
        $(this).addClass("active");
        break;
      case 3:
        $("#menu4").removeClass("active");
        $(tabs[currentTab]).removeClass("active_b");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_b");
        $("#submenu2").removeClass("noactive_b");
        $("#submenu3").removeClass("noactive_b");
        $(this).addClass("active");
        break;        
    }

    currentNav = 1;
    for(var i=0; i < 10; i++){
      $(arr[i]).hide();
    }

    $("#eclosions_edito").show("slow");

    currentTab=0;
    $(tabs[currentTab]).addClass("active_r");
    $("#submenu2").addClass("noactive_r");
    $("#submenu3").addClass("noactive_r");

    $("#middle").css("background-color","#FF605E");
  });



  $("#menu3").click( function() {
    console.log('clic menu3');

    $("#right iframe").attr("src", "map3.html");
    $("#submenu li").css("border-right", "2px solid #42B69E");
    $("#submenu").show("fast");

    switch(currentNav){
      case 0:
        $("#menu1").removeClass("active");
        $(tabs[currentTab]).removeClass("active_j");

        //clean all the tabs
        $("#submenu1").removeClass("noactive_j");
        $("#submenu2").removeClass("noactive_j");
        $("#submenu3").removeClass("noactive_j");
        $(this).addClass("active");
        break;
      case 1:
        $("#menu2").removeClass("active");
        $(tabs[currentTab]).removeClass("active_r");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_r");
        $("#submenu2").removeClass("noactive_r");
        $("#submenu3").removeClass("noactive_r");
        $(this).addClass("active");
        break;
      case 2:
        $("#menu3").removeClass("active");
        $(tabs[currentTab]).removeClass("active_b");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_b");
        $("#submenu2").removeClass("noactive_b");
        $("#submenu3").removeClass("noactive_b");
        $(this).addClass("active");
        break;
      case 3:
        $("#menu4").removeClass("active");
        $(tabs[currentTab]).removeClass("active_b");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_b");
        $("#submenu2").removeClass("noactive_b");
        $("#submenu3").removeClass("noactive_b");
        $(this).addClass("active");
        break;
    }

    currentNav = 2;
    for(var i=0; i < 10; i++){
      $(arr[i]).hide();
    }

    $("#quartiers_edito").show("slow");

    currentTab=0;
    $(tabs[currentTab]).addClass("active_b");
    $("#submenu2").addClass("noactive_b");
    $("#submenu3").addClass("noactive_b");

    $("#middle").css("background-color","#42B69E");
  });


  $("#menu4").click( function() {
    console.log('clic menu4');

    $("#right iframe").attr("src", "map4.html");
    $("#submenu li").css("border-right", "2px solid #42B69E");
    $("#submenu").hide();

    switch(currentNav){
      case 0:
        $("#menu1").removeClass("active");
        $(tabs[currentTab]).removeClass("active_j");

        //clean all the tabs
        $("#submenu1").removeClass("noactive_j");
        $("#submenu2").removeClass("noactive_j");
        $("#submenu3").removeClass("noactive_j");
        // $(this).addClass("active");
        break;
      case 1:
        $("#menu2").removeClass("active");
        $(tabs[currentTab]).removeClass("active_r");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_r");
        $("#submenu2").removeClass("noactive_r");
        $("#submenu3").removeClass("noactive_r");
        // $(this).addClass("active");
        break;
      case 2:
        $("#menu3").removeClass("active");
        $(tabs[currentTab]).removeClass("active_b");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_b");
        $("#submenu2").removeClass("noactive_b");
        $("#submenu3").removeClass("noactive_b");
        // $(this).addClass("active");
        break;
      case 3:
        $("#menu4").removeClass("active");
        $(tabs[currentTab]).removeClass("active_b");
        
        //clean all the tabs
        $("#submenu1").removeClass("noactive_b");
        $("#submenu2").removeClass("noactive_b");
        $("#submenu3").removeClass("noactive_b");
        // $(this).addClass("active");
        break;
    }

    currentNav = 3;
    for(var i=0; i < 10; i++){
      $(arr[i]).hide();
    }

    $("#credits").show("slow");

    currentTab=0;
    $(tabs[currentTab]).addClass("active_b");
    $("#submenu2").addClass("noactive_b");
    $("#submenu3").addClass("noactive_b");

    $("#middle").css("background-color","#B4CD36");
  });




  /* TABS HANDLING */
  $("#submenu1").click( function() {
    console.log('clic submenu1');
    for(var i=0; i < 10; i++){
      $(arr[i]).hide();
    }

    console.log(currentNav);
    switch(currentNav){
      case 0:
        $("#ca_pousse_edito").show("slow");
        $(tabs[currentTab]).removeClass("active_j");
        $(tabs[currentTab]).addClass("noactive_j");
        $(this).removeClass("noactive_j");
        $(this).addClass("active_j");
        break;
      case 1:
        $("#eclosions_edito").show("slow");
        $(tabs[currentTab]).removeClass("active_r");
        $(tabs[currentTab]).addClass("noactive_r");
        $(this).removeClass("noactive_r");
        $(this).addClass("active_r");
        break;
      case 2:
        $("#quartiers_edito").show("slow");
        $(tabs[currentTab]).removeClass("active_b");
        $(tabs[currentTab]).addClass("noactive_b");
        $(this).removeClass("noactive_b");
        $(this).addClass("active_b");
        break;
    }
    currentTab=0;
  });

  $("#submenu2").click( function() {
    console.log('clic submenu2');
    for(var i=0; i < 10; i++){
      $(arr[i]).hide();
    }

    console.log(currentNav);
    switch(currentNav){
      case 0:
        $("#ca_pousse_sondage").show("slow");
        $(tabs[currentTab]).removeClass("active_j");
        $(tabs[currentTab]).addClass("noactive_j");
        $(this).removeClass("noactive_j");
        $(this).addClass("active_j");
        break;
      case 1:
        $("#eclosions_sondage").show("slow");
        $(tabs[currentTab]).removeClass("active_r");
        $(tabs[currentTab]).addClass("noactive_r");
        $(this).removeClass("noactive_r");
        $(this).addClass("active_r");
        break;
      case 2:
        $("#quartiers_sondage").show("slow");
        $(tabs[currentTab]).removeClass("active_b");
        $(tabs[currentTab]).addClass("noactive_b");
        $(this).removeClass("noactive_b");
        $(this).addClass("active_b");
        break;
    }
    currentTab=1;
  });


  $("#submenu3").click( function() {
    console.log('clic submenu3');
    for(var i=0; i < 10; i++){
      $(arr[i]).hide();
    }

    console.log(currentNav);
    switch(currentNav){
      case 0:
        $("#ca_pousse_photos").show("slow");
        $(tabs[currentTab]).removeClass("active_j");
        $(tabs[currentTab]).addClass("noactive_j");
        $(this).removeClass("noactive_j");
        $(this).addClass("active_j");
        break;
      case 1:
        $("#eclosions_photos").show("slow");
        $(tabs[currentTab]).removeClass("active_r");
        $(tabs[currentTab]).addClass("noactive_r");
        $(this).removeClass("noactive_r");
        $(this).addClass("active_r");
        break;
      case 2:
        $("#quartiers_photos").show("slow");
        $(tabs[currentTab]).removeClass("active_b");
        $(tabs[currentTab]).addClass("noactive_b");
        $(this).removeClass("noactive_b");
        $(this).addClass("active_b");
        break;
    }
    currentTab=2;
  });
});
