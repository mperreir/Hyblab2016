
//Handle the map controls
//zoom, rotation ...
var map = new GLMap('map', {
    position: { latitude:48.4082, longitude:-4.4982 },
    zoom: 16,
    minZoom: 12,
    maxZoom: 20,
    state: true // stores map position/rotation in url
});


//Creation of the map
var osmb = new OSMBuildings({
  minZoom: 15,
  maxZoom: 22,
  attribution: '© 3D <a href="http://osmbuildings.org/copyright/">OSM Buildings</a>',
}).addTo(map);


//remote call to an API to collect the tiles of the looked area
osmb.addMapTiles(
  'http://{s}.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/{z}/{x}/{y}.png',
  {
    attribution: '© Data <a href="http://openstreetmap.org/copyright/">OpenStreetMap</a> · © Map <a href="http://mapbox.com">MapBox</a>'
  }
);

//Collecting the 3D data over API call
//Doesnt allow to retrieve the height data of buildings (better use our own data for that)
/*osmb.addGeoJSONTiles('http://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');*/


/*var geojson2 = {
  type: 'FeatureCollection',
  features: [
    { "type": "Feature", "properties": 
    { "OBJECTID": 7.000000, 
      "DEPCO": "29075", 
      "CSCDA": "C",
      "TYPE": "D", 
      "SURFACE": "49", 
      "LENGTH": 28.200000, 
      "SHAPE_AREA": 48.690000, 
      "cadastre_2015_avec_hauteur_H_max": 3.140000,
      color: '#FF4000',
      roofColor: '#FF4000',
      height: 300,
      minHeight: 0 
    },"geometry": 
    { "type": "Polygon", 
      "coordinates": [ [ [ -4.351628300245521, 48.431108484872624 ], [ -4.351549965834691, 48.431124014356364 ], [ -4.351518783194311, 48.431054661648609 ], [ -4.351597104943131, 48.431039042610308 ], [ -4.351628300245521, 48.431108484872624  ] ] ]
    }}, 
    { "type": "Feature", "properties": 
    { "OBJECTID": 110.000000, 
      "DEPCO": "29019", 
      "CSCDA": "AW", 
      "TYPE": "D", 
      "SURFACE": "803", 
      "LENGTH": 116.390000, 
      "SHAPE_AREA": 802.700000, 
      "cadastre_2015_avec_hauteur_H_max": 6.550000,
      color: '#FF4000',
      roofColor: '#FF4000',
      height: 300,
      minHeight: 0 
    },"geometry": 
    { "type": "Polygon", 
      "coordinates": [ [ [ -4.457091276180201, 48.410756673651527 ], [ -4.45699796635661, 48.410427111561511 ], [ -4.457300684900114, 48.410389134731403 ], [ -4.457383537897842, 48.410682395599601 ], [ -4.457091276180201, 48.410756673651527 ]
        ] ] 
    } 
  }]};*/



  /* JSON File loading */
  console.log( "loading data from server..." );
  $.get('data/cbats.geojson', function(data) { // JQuery HTTP GET request to the server
      //If the request is OK :

      //TODO : Doesn't work doesnt succeed to parse the data.
      var constrBats = JSON.parse(data); // parse json string answer to get a javascript object

      //osmb.addGeoJSON(geojson2);
      osmb.addGeoJSON(constrBats);
  });

/*$(document).ready(function () {    
            $.getJSON('../../data/cbats.geojson', function (data) {
                var items = [];
                $.each(data.features, function (key, val) {
                    $.each(val.properties, function(i,j){
                        items.push('<li id="' + i + '">' + j + '</li>');
                    })              
                });
                $('<ul/>', {
                    'class':'my-new-list',
                    html:items.join('')
                }).appendTo('body');
      });
});*/

/* ANIMATIONS */
  var valuesFrom = {latitude: 48.431108484872624, longitude: -4.351628300245521, rotation: 0, zoom: 15, tilt: 10},
    valuesTo = {latitude: 48.410756673651527, longitude: -4.457091276180201, rotation: -25, zoom: 15, tilt: 10},
    animationTime = 15000;

  var tween = new TWEEN.Tween(valuesFrom)
      .to(valuesTo, animationTime)
      .onUpdate(function() {
          // here we call the functions to update the map state
          map.setPosition({ latitude: this.latitude, longitude: this.longitude });
          map.setRotation(this.rotation);
          map.setZoom(this.zoom);
          map.setTilt(this.tilt);
      })
      .start(5000);

  requestAnimationFrame(animate);

  function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
  }

  //***************************************************************************

  map.on('pointermove', function(e) {
    var id = osmb.getTarget(e.x, e.y, function(id) {
      if (id) {
        document.body.style.cursor = 'pointer';
        osmb.highlight(id, '#f08000');
      } else {
        document.body.style.cursor = 'default';
        osmb.highlight(null);
      }
    });
  });

  //***************************************************************************

  var controlButtons = document.querySelectorAll('.control button');

  for (var i = 0, il = controlButtons.length; i < il; i++) {
    controlButtons[i].addEventListener('click', function(e) {
      var button = this;
      var parentClassList = button.parentNode.classList;
      var direction = button.classList.contains('inc') ? 1 : -1;
      var increment;
      var property;

      if (parentClassList.contains('tilt')) {
        property = 'Tilt';
        increment = direction*10;
      }
      if (parentClassList.contains('rotation')) {
        property = 'Rotation';
        increment = direction*10;
      }
      if (parentClassList.contains('zoom')) {
        property = 'Zoom';
        increment = direction*1;
      }
      if (property) {
        map['set'+ property](map['get'+ property]()+increment);
      }
    });
  }