(function() {
    "use strict";

    function getIMDRank(lsoa) {
        return window.data[lsoa]["IMD"]["rank"];
    }

    function meanLSOA() {
        var count;
        return Object.keys(window.data)
        .map(function (lsoa11cd) {
            count += 1;
            return window.data[lsoa11cd][indicator].raw;
        }).reduce(function (a, b) {
            return a + b;
        }) / count;
    }

    function maxLSOA() {
        return Object.keys(window.data).reduce(function (a, b) {
            return getIMDRank(a) > getIMDRank(b) ? a : b;
        })[0];
    }

    function minLSOA() {
        return Object.keys(window.data).reduce(function (a, b) {
            return getIMDRank(a) < getIMDRank(b) ? a : b;
        })[0];
    }

    function medianLSOA() {
        var values = Object.keys(window.data)
        .map(function (lsoa11cd) {
            return window.data[lsoa11cd][indicator].raw;
        }).sort(function (a, b) {
            return a - b;
        });

        return values[values.length() / 2];
    }

    function updateChart(which) {
        var indicator,
            data,
            lsoa11cd = PCDtoLSOA11CD($("#" + which + "_postcode_rope").get()[0].value);

        if (!lsoa11cd) {
            return;
        } else {
            data = window.data[lsoa11cd];
        }

        for (indicator in INDICATORS) {
            $("#" + which + "_" + indicator).css("width", "" + 10*data[indicator]["decile"] + "%");
        }
    }

    function enableOther() {
        $("#their_postcode_rope").enable();
    }

    function disableOther() {
        $("#their_postcode_rope").disable();
    }

    function selectReference(reference) {
        disableOther();

    }

    $("#our_postcode_rope").change(updateChart.bind(undefined, "our"));
    $("#their_postcode_rope").change(updateChart.bind(undefined, "their"));
}());
