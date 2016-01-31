// Load usefull expressjs and nodejs objects / modules
var express = require('express');
var path = require('path');
var request = require('request');
var fs = require('fs');

var app = express();

// Minimum routing: serve static content from the html directory
app.use(express.static(path.join(__dirname, 'html')));

// You can then add whatever routing code you need


/*// if asked for some data, read our json data file and send it back to the browser.
// of course we could just declare '/data' as a static path that node should serve, 
// but declaring a HTML GET callback like done below allows to have the
// same url for accessing data with server-api.js and server-file.js.
// in a sens we are building here a very simple RESTful API.
app.get('/data', function(req,res){
  // here we don't need to process any query string...
  // but if we had to do so (ex: /data?file=parking.json)
  // we could get (very simply) 'req.query.file' variable
  // see also 'req.param' array
  
  // read the file (asynchronously, aka the nodejs way)

  //reads correctly the file (can display the buffer using the console.log(data) )
  fs.readFile(path.join(__dirname, 'data/cbats.geojson'), function (error, data) {
    if (!error) {
		//console.log(data);
      	res.send(data);
    } 
    else
      console.log(error);
  });
})
*/

// This module is exported and served by the main server.js located
// at the root of this set of projects. You can access it by lanching the main
// server and visiting http(s)://127.0.0.1:8080/name_of_you_project/ (if on a local server)
// or more generally: http(s)://server_name:port/name_of_you_project/
module.exports = app;
