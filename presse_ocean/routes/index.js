"use strict";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Production'});
});

/* GET circle. */
router.get('/circle', function (req, res, next) {
    res.render('evolcircle', {title: 'Evolution Circle'});
});

/* GET map. */
router.get('/map', function (req, res, next) {
    res.render('map', {title: 'Nantes\'s Map'});
});

/* GET nav. */
router.get('/nav', function (req, res, next) {
    res.render('subslide', {title: 'Navigator'});
});

/* GET nav. */
router.get('/cloud', function (req, res, next) {
    res.render('cloud', {title: 'Cloudify !'});
});

module.exports = router;
