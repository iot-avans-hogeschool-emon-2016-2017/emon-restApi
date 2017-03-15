var express = require('express');
var cool = require('cool-ascii-faces');

var api = express();

api.set('port', (process.env.PORT || 5000));

api.get('/', function(request, response) {
  const responseString = "Welcome by the restapi for measurements: ";

  response.send(responseString+cool());
});

api.listen(api.get('port'), function () {
  console.log('Node.js app is running on port', api.get('port'));
});