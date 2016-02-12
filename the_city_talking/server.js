'use strict';

var fs = require('fs');
var moment = require('moment');
var webpack = require('webpack');
var npm = require('npm');

// BUILDING CLIENT SIDE JAVASCRIPT
npm.load({loglevel:"silent",progress:false}, function() {
	console.info("the_city_talking : Building client .js");
	console.info("the_city_talking : Installing npm dependencies");
	npm.commands.install([],function(err,data) {
		if (err) {
			console.error(err);
		}
		console.info("the_city_talking : Done installing npm dependencies, running webpack");
		webpack(require(path.resolve(__dirname,"webpack.config.js")),function(err,stats) {
			if (err){
				console.error(err);
			}
			if (stats.hasErrors()){
				console.error("the_city_talking : webpack encoutered an error");
				console.error(stats.toString());
			}else{
				console.info("the_city_talking : Successfully built client .js");
			}
		})
	})
})
// END BUILDING CLIENT SIDE JAVASCRIPT

function truncate(value){
	return Math.round(100 * value) / 100 ;
}

function averageADay(oneDay){
	var averageOneDay = {"NO":0,"NO2":0,"PM25":0} ;
	var countParticles = {"NO":0,"NO2":0,"PM25":0} ;
	oneDay.forEach(function(v,hour) {
		for ( var particle in v){
			if (!isNaN(v[particle])){
				countParticles[particle] += 1 ;
				averageOneDay[particle] += v[particle] ;
			}
		}
	});
	averageOneDay["NO2"] = truncate(averageOneDay["NO2"] / countParticles["NO2"]) ;
	averageOneDay["NO"] = truncate(averageOneDay["NO"] / countParticles["NO"]) ;
	averageOneDay["PM25"] = truncate(averageOneDay["PM25"] / countParticles["PM25"]) ;

	return averageOneDay ;
}

function makeAnAverageDay(multipleDays){
	var array_data_oneDay = [];
	var countParticles = [] ;
	for (var i = 0 ; i < 24 ; i++){
		array_data_oneDay.push({"NO":0,"NO2":0,"PM25":0});
		countParticles.push({"NO":0,"NO2":0,"PM25":0});
	}
	multipleDays.forEach( function(dataOneHour) {
		dataOneHour.hours.forEach(function(particlesOneHour,hour) {
			for ( var particle in particlesOneHour){
				if (!isNaN(particlesOneHour[particle])){
					array_data_oneDay[hour][particle] += particlesOneHour[particle];
					countParticles[hour][particle] += 1 ;
				}
			}
		});
	});
	array_data_oneDay.map( function(hourData,hour) {
		hourData["NO2"] = truncate( hourData["NO2"] / countParticles[hour]["NO2"] ) ;
		hourData["NO"] = truncate( hourData["NO"] / countParticles[hour]["NO"] ) ;
		hourData["PM25"] = truncate( hourData["PM25"] / countParticles[hour]["PM25"] ) ;
	})
	return array_data_oneDay ;
}

function processData(err,data,f,b,filterDay){
	data = data.split('\n').map(function(line) {
		line = line.split(',');
		return line ;
	});
	var data_filtered = {};
	data.forEach(function(line) {
		var date = line[0];
		data_filtered[date] = data_filtered[date] || {hours:[]};
		data_filtered[date].hours.push({"NO":parseInt(line[8]),"NO2":parseInt(line[11]),"PM25":parseInt(line[20])});
	})
	var array_data_filtered = [] ;
	for (var date in data_filtered){
		if (date != ''){
			data_filtered[date].date = moment(date,"DD-MM-YYYY");
			array_data_filtered.push(data_filtered[date]);
		}
	}

	array_data_filtered = array_data_filtered.filter(filterDay)

	// b = TRUE if you want an average day (1 pt = 1 hour)
	// b = FALSE if you want every day on a span (1pt = 1 day)
	if (b){
		f(makeAnAverageDay(array_data_filtered).map(function(value,index) {
				value["Hour"] = (index+1)+":00" ;
				return value ;
		}))
	}else{
		f(array_data_filtered.map(function(value) {
			var tmp = averageADay(value.hours) ;
			tmp['Date'] = value.date.format("DD-MM-YYYY") ;
			return tmp ;
		}))
	}
}

// Load usefull expressjs and nodejs objects / modules
var express = require('express');
var path = require('path');

var app = express();

// Minimum routing: serve static content from the html directory
app.get('/json_centre/:json',function(req,res) {
	var result = /^(\d{2}\-\d{4})\.json$/.exec(req.params.json);
	if (result == null){
		res.status(404);
		res.send("requete invalide");
	}else{
		var month = result[1] ;
		fs.readFile(path.join(__dirname,'data/Centre_all_years.csv'),'utf8',function(err,data) {
			processData(err,data,function(e) {return res.json(e)},true,function(obj) {return obj.date.format("MM-YYYY") == result[1]});
		});
	}
})

app.get('/json_kerbside/:json',function(req,res) {
	var result = /^(\d{2}\-\d{4})\.json$/.exec(req.params.json);
	if (result == null){
		res.status(404);
		res.send("requete invalide");
	}else{
		var month = result[1] ;
		fs.readFile(path.join(__dirname,'data/HeadingleyKerbside_all_years.csv'),'utf8',function(err,data) {
			processData(err,data,function(e) {return res.json(e)},true,function(obj) { return obj.date.format("MM-YYYY") == result[1]});
		});
	}
})

app.get('/per_month_centre.csv',function(req,res) {
	res.sendFile(path.join(__dirname,'data/per_month_centre.csv'));
})

app.get('/per_month_kerbside.csv',function(req,res) {
	res.sendFile(path.join(__dirname,'data/per_month_kerbside.csv'));
})

app.get('/prescriptions.csv',function(req,res) {
	res.sendFile(path.join(__dirname,'data/prescriptions.csv'));
})

app.use(express.static(path.join(__dirname, 'html')));

// You can then add whatever routing code you need

// This module is exported and served by the main server.js located
// at the root of this set of projects. You can access it by lanching the main
// server and visiting http(s)://127.0.0.1:8080/name_of_you_project/ (if on a local server)
// or more generally: http(s)://server_name:port/name_of_you_project/
module.exports = app;
