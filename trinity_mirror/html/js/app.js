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
    a015: "0-15.p",
    a1625: "16-25.p",
    a2635: "26-35.p",
    a3655: "36-55.p",
    a5690: "56-90.p"
    // average: "ages.average"
};

var GROUPS = {
    a015: "0-15",
    a1625: "16-25",
    a2635: "26-35",
    a3655: "36-55",
    a5690: "56-90"
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
    $("#fullpage").fullpage({
        scrollBar: true,
        scrollingSpeed: 300
    });

    $(".next-slide").click(function () {
        $.fn.fullpage.moveSectionDown();
    });
}())
