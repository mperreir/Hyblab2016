(function() {
    "use strict";

    function mean(indicator) {
        var count;
        return Object.keys(window.data)
        .map(function (lsoa11cd) {
            count += 1;
            return window.data[lsoa11cd][indicator].raw;
        }).reduce(function (a, b) {
            return a + b;
        }) / count;
    }

    function max(indicator) {
        return Object.keys(window.data)
        .map(function (lsoa11cd) {
            return window.data[lsoa11cd][indicator].raw;
        }).reduce(function (max, a) {
            return a > max ? a : max;
        });
    }

    function min(indicator) {
        return Object.keys(window.data)
        .map(function (lsoa11cd) {
            return window.data[lsoa11cd][indicator].raw;
        }).reduce(function (max, a) {
            return a < max ? a : max;
        });
    }

    function median(indicator) {
        var values = Object.keys(window.data)
        .map(function (lsoa11cd) {
            return window.data[lsoa11cd][indicator].raw;
        }).sort(function (a, b) {
            return a - b;
        });

        return values[values.length() / 2];
    }
}());



