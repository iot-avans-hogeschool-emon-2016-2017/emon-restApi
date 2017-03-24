var express = require('express');
var router = express.Router();

var login = require('./login');

router.all('/', function (req, res, next) {
  console.log('Get in router with', req.method, req.url);

  res.status(200).json({"Welcome":"In the router"})
});

router.post('/login', login);

module.exports = router;