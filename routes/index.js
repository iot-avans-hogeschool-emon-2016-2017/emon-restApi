var express = require('express');
var router = express.Router();


/*Routes for router*/
var login = require('./login');
var measurement  = require('./measurement');
var token = require('./token');

router.all(/[^(\/login)]/, token);

router.get('/measurement', measurement.get.all);
router.get('/measurement/:id', measurement.get.byUser);

router.post('/login', login);
router.post('/measurement', measurement.post);


module.exports = router;