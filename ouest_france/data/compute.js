"use stricte";

var fs = require('fs');

fs.readFile('./data.json', 'utf8', function(err,data){
		if(err){
			throw err;
		} 
		else{
			var donnees = JSON.parse(data); 
			
			var carburant = donnees.carburant;

			compute(donnees.carburant);
			compute(donnees.achat);
			fs.writeFile('./data.json', JSON.stringify(donnees, null, 4), function(err){
				if(err) throw err;
				else console.log("Saved!");
			})			
		}	
	}); 

function compute(objet){
	objet.years.forEach(function(year){
		var total = 0;
		for(element in objet.data){
			total += objet.data[element][year].val;
		}
		console.log(year+" ==> "+total);

		for(element in objet.data){
			objet.data[element][year].pourcentage = objet.data[element][year].val/total*100;
			console.log(element + " ==>" +objet.data[element][year].pourcentage);
		}
	});
};