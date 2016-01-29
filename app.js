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
    //$("#fullpage").fullpage();
}())
