const d3 = require('d3');

function parseDay(d){
	return {
		"Hour":d.Hour,
		"NO":+d.NO,
		"NO2":+d.NO2,
		"PM25":+d.PM25,
	}
}

d3.csv("data/average_sun.csv")
	.row(parseDay)
	.get((err,rows) => {console.log(rows)});
