var express = require('express');
var router = express.Router();

/*Routes for router*/
var login = require('./login');
var measurement  = require('./measurement');
var token = require('./token');

router.all(/[^(\/login)]/, token);

router.post('/login', login);
router.post('/measurement', measurement.post);

router.post('/measurements', measurement.post);
router.post('/measurements/user/:id', measurement.get.byUser);
router.post('/measurements/time/', measurement.get.byTime);

module.exports = router;