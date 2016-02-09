'use strict'

var express = require('express');
var app = express();


// Le contenu statique sera lu à partir du repertoire 'public'
// A déclarer à la fin pour qu'on aille chercher dans 'public' seulement si aucune auter règle n'est applicable
app.use('/', express.static('public'));

// Lancement du serveur web
var server = app.listen(8080, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('My app is listening at http://%s:%s', host, port);
});

