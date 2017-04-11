var jwt = require('jwt-simple');
var moment = require('moment');
var _ = require('lodash');

var database = require('../database');

const token = function (req, res, next) {
  var token = req.header('X-Access-Token') || req.body.token || req.query.token || '';

  if (token) {
    try {
      token = jwt.decode(token, req.app.get('secretKey'));

      if (validate_token(token)) {
        const id = token.iss;
        getUser(id, function (user) {
          if (user) {
            req.app.set('user', user);
            next();
          } else {
            unknownUser(res);
          }
        });
      } else {
        inValidToken(res);
      }
    } catch(err) {
      inValidToken(res);
    }
  } else {
    noToken(res);
  }
};

/**
 * @param token, token-object dat succesvol is gedecoded door jwt.decode
 * @returns {boolean}, True als de iss key in het token-object een nummer is,
 * dit nummer staat voor een uniek id in de database
 */

function validate_token(token) {
  const id = token.iss || '';
  return _.isNumber(id);
}

function getUser(id, callback) {
  database.executeQuery('select * from users where id = '+id, function (response) {

    var user = null;
    if (response.status === 200) {
      user = response.result[0];
    }

    if (callback) callback(user);
  });
}

/*response functions*/
function noToken(res) {
  res.status(400).json({
    "message": "no token"
  });
}

function inValidToken(res) {
  res.status(400).json({
    "message:": "invalid token"
  })
}

function unknownUser(res) {
  res.status(404).json({
    "message": "unknown user"
  })
}


module.exports = token;