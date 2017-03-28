var express = require('express');
var router = express.Router();

var jwt = require('jwt-simple');
var moment = require('moment');

var login = require('./login');
var measurement  = require('./measurement');

router.all(/[^(\/login)]/, function (req, res, next) {
  const token = req.header('X-Access-Token') || '';

  if (token) {
    var decoded_token = jwt.decode(token, req.app.get('secretKey'));

    //lookup in database
    const dUsername = req.app.get('username');
    if (validate_token(decoded_token, dUsername)) {

      //@TODO userId from database
      req.app.set('userId', decoded_token.iss);
      next();
    } else {
      res.status(404).json({
        "message": "unknown user"
      });
    }
  } else {
    res.status(400).json({
      "message": "no token"
    });
  }
});

function validate_token(decoded_token, dUsername) {
  /*@TODO check username in database*/
  /*@TODO add to check if token time isn't expired*/

  const username = decoded_token.iss;
  var isValid = false;

  if (username === dUsername) {isValid = true;}

  return isValid;
}

router.post('/login', login);
router.post('/measurement', measurement);

module.exports = router;