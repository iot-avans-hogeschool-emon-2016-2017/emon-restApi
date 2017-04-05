var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routes');
var database = require('./database');

var api = express();

api.set('port', (process.env.PORT || 5000));
api.set('db', database);

var settings = require('./config.json');
Object.keys(settings).forEach(function (key) {
  api.set(key, settings[key]);
});

api.use(bodyParser.urlencoded({extended: true}));
api.use(bodyParser.json());
api.use(bodyParser.text({extended: true}));
api.use(bodyParser.raw({extended: true}));

api.all('*', function (req, res, next) {

  console.log('Get in api with', req.method, req.url);
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers','Content-Type, X-Access-Token, Origin, X-Requested-With, Accept');

  if (req.method === 'POST' && req.header('Content-Type') === 'text/plain') {
    req.body = JSON.parse(req.body);
  }

  next();
});

api.use(router);

api.listen(api.get('port'), function () {
  console.log('Node.js app is running on port', api.get('port'));
});
