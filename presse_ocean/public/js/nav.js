"use strict";

$(document)
  .ready(function() {
    $('#fullpage')
      .fullpage({
        verticalCentered : false,
        menu : '#menu',
        anchors : [
          '1stPage',
          '2ndPage',
          '3rdPage',
          '4thPage',
          '5thPage',
          '6thPage'
        ]
      });
  });
