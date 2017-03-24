var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routes');

var api = express();

api.set('port', (process.env.PORT || 5000));

var settings = require('./config.json');
Object.keys(settings).forEach(function (key) {
  api.set(key, settings[key]);
});

api.use(bodyParser.urlencoded({extended: true}));
api.use(bodyParser.json());

api.all('*', function (req, res, next) {

  console.log('Get in api with', req.method, req.url);
  next();
});

api.use(router);

api.listen(api.get('port'), function () {
  console.log('Node.js app is running on port', api.get('port'));
});