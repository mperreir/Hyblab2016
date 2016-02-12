var express = require('express')
//var basicAuth = require('basic-auth-connect');
var app = express()


// password protection
//app.use(basicAuth('ddj2016', 'iloveddj'));

// declare the list of sub apps
var app_names = [];

var ddj2016_names = ['centre_national_du_cinema', 'films_en_bretagne', 'france_3_bretagne',
 								'la_frap', 'le_journal_des_entreprises', 'le_telegramme', 'loire_atlantique_fr',
								'map_et_dipp', 'ouest_france', 'pays_de_la_loire_fr', 'presse_ocean',
								'the_city_talking', 'trinity_mirror'];

app_names.push.apply(app_names, ddj2016_names);

var sub_apps = [];

// create sub apps
// and register sub-apps
app_names.forEach( function( element, index, array) {
  console.log("Registering: " + element);
	sub_apps[element] = require('./' + element + '/server');
	app.use('/' + element, sub_apps[element]);
});

// redirect catch all url to hyblab website
app.use(/\/$/,function(req, res, next){
	res.redirect('http://www.hyblab.fr/evenements/hyblab-datajournalisme/');
});


// launch main server app
var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Hyblab DDJ 2016 routing app listening at http://%s:%s', host, port)

})
