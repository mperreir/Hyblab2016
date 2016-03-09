function doMap( url )
{

//Handle the map controls
//zoom, rotation ...
var map = new GLMap('map', {
    position: { latitude:48.4082, longitude:-4.4982 },
    zoom: 13,
    minZoom: 5,
    maxZoom: 20,
    state: true // stores map position/rotation in url
});


//Creation of the map
var osmb = new OSMBuildings({
  minZoom: 8,
  maxZoom: 22,
  attribution: '© 3D <a href="http://osmbuildings.org/copyright/">OSM Buildings</a>',
}).addTo(map);


//remote call to an API to collect the tiles of the looked area
osmb.addMapTiles(
  'https://{s}.tiles.mapbox.com/v3/osmbuildings.kbpalbpk/{z}/{x}/{y}.png',
  {
    attribution: '© Data <a href="http://openstreetmap.org/copyright/">OpenStreetMap</a> · © Map <a href="http://mapbox.com">MapBox</a>'
  }
);

  //Collecting the 3D data over API call
  //Doesnt allow to retrieve the height data of buildings (better use our own data for that)
  /*osmb.addGeoJSONTiles('http://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');*/


  /* JSON File loading */
  console.log( "loading data from server..." );
  $.get(url, function(data) { // JQuery HTTP GET request to the server
      //If the request is OK :

      var constrBats = JSON.parse(data); // parse json string answer to get a javascript object
      osmb.addGeoJSON(constrBats);

      // Ajout des batiments d'OSM Buildings (en gris et chargement au streaming de ces batiments)
      // via l'API OSM Buildings qui fournis un accès gratuit
      // osmb.addGeoJSONTiles('http://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');
  });

/* ANIMATIONS */
// Exemple d'animation, uniquement pour la première carte, plus d'infos dans la doc OSM Building pour configurer
// (voir la page github et le readme associé d'OSM Building)

  /*var valuesFrom = {latitude: 48.3714, longitude: -4.4849, rotation: 0, zoom: 12, tilt: 10},
    valuesTo = {latitude: 48.39074, longitude: -4.48574, rotation: 40, zoom: 16, tilt: 30},
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
      .start(13000);

  requestAnimationFrame(animate);

  function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
  }*/

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
}
