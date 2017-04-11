var express = require('express');
var router = express.Router();

/*Routes for router*/
var login = require('./login');
var measurement  = require('./measurement');
var token = require('./token');

router.all(/[^(\/login)]/, token);

//post requests
router.post('/login', login);
router.post('/measurement', measurement.post);

//get by post request, set token in body
router.post('/measurements', measurement.get.all);
router.post('/measurements/user/:id', measurement.get.byUser);
router.post('/measurements/time/', measurement.get.byTime);
router.post('/measurements/time/hour', measurement.get.byHourInterval);
router.post('/measurements/trend', measurement.get.trend);

//get requests, token in query
router.get('/measurements/last', measurement.get.getLast);

module.exports = router;