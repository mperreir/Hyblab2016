var NUMBER_LSOA = 32844;

var INDICATORS = {
    crime: "Crime",
    income: "Income",
    employment: "Employment",
    education: "Education, Skills and Training",
    health: "Health Deprivation and Disability",
    housing: "Barriers to Housing and Services",
    environment: "Living Environment"
};

var AGES = {
    a04: "0-4",
    a59: "5-9",
    a1014: "10-14",
    a1519: "15-19",
    a2024: "20-24",
    a2529: "25-29",
    a3034: "30-34",
    a3544: "35-44",
    a4554: "45-54",
    a5564: "55-64",
    a6574: "65-74",
    a7584: "75-84",
    a8590: "85-90"
};

var SUBDOMAIN = [
    "income ..............",
    "employment............",
    "education...........",
    "health.............",
    "crime.............",
    "housing...............",
    "environment................"
];

L.TopoJSON = L.GeoJSON.extend({
    addData: function(jsonData) {
        if (jsonData.type === "Topology") {
            for (key in jsonData.objects) {
                geojson = topojson.feature(jsonData, jsonData.objects[key]);
                L.GeoJSON.prototype.addData.call(this, geojson);
            }
        }
        else {
            L.GeoJSON.prototype.addData.call(this, jsonData);
        }
    }
});

// Utility variable for mapping postcode to LSOA11CD
var PCD_LSOA11CD_mapper = (function () {
    var mapper = {};
    for (var LSOA11CD in window.data) {
        for (var pcd in window.data[LSOA11CD]["PCD7s"]) {
            pcd = window.data[LSOA11CD]["PCD7s"][pcd].replace(/ /g, '');
            mapper[pcd] = LSOA11CD;
        }
    }
    return mapper;
}());

function PCDtoLSOA11CD(PCD) {
    return PCD_LSOA11CD_mapper[PCD.replace(/ /g, '')];
}



(function() {
    $("#fullpage").fullpage({
        scrollBar: true,
        scrollingSpeed: 300
    });
})
