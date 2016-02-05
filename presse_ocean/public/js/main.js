"use strict";

$(document)
  .ready(function() {
    // init visit counter for lazy loading functions
    var visited = {};
    for (var i = 1; i < 8; i++) {
      visited[i] = false;
    }

    $('#fullpage')
      .fullpage({
        verticalCentered : false,
        menu : '#menu',
        anchors : [
          'Introduction',
          'IntroLogements',
          'CarteLogements',
          'IntroLocataires',
          'CarteLocataires',
          'CarteSecondaires',
          'Reportage',
          'Conclusion'
        ],
        onLeave : function(index, nextIndex, direction) {
          // Menu operations
          if (nextIndex != 1) {
            $("#menu").show(500);
          } else if (nextIndex == 1) {
            $("#menu").hide(500);
          }

          // Lazy loading operations
          switch (nextIndex) {
            case 3: // logements Map
              if (!visited[nextIndex]) {
                $.getScript("/js/map1.js");
              }
              break;
            case 5: // locataires Map
              if (!visited[nextIndex]) {
                $.getScript("/js/map2.js");
              }
              break;
            case 6: // secondaires Map
              if (!visited[nextIndex]) {
                $.getScript("/js/map3.js");
              }
              break;
            default:
              break;
          }
          visited[index] = true;
          visited[nextIndex] = true;
        }
      });

    $("#menu").hide(100);

    $('.next-page').on('click', function() { $.fn.fullpage.moveSectionDown(); })
  });