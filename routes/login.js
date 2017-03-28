var jwt = require('jwt-simple');
var moment = require('moment');
var database = require('../database');
var _ = require('lodash');

/*
* Login function is case sensitive
* default login is admin, admin*/


const login = function (req, res) {
  const userN = req.body.username || '';
  const passW = req.body.password || '';

  if (userN === '' || passW === '') {
    noUsernameOrPassword(res);
    return;
  }

  database.executeQuery('select * from users', function (result) {
    if (result.status === 200 ) {
      const users = result.result;

      console.log(userN, passW, 'users:', users);
      const user = _.find(users,{'username':userN, 'password': passW});
      console.log(user);

      if (user && typeof user !== 'undefined') {
        const token = buildToken(user, req.app.get('secretKey'));
        approve(res, token);
      } else {
        noUsernameOrPasswordInDB(res);
      }
      return;
    }

    serverError(res, result);
  });
};

function buildToken(user, secretKey) {
  const expires = moment().add(10, 'days');

  return jwt.encode({
    "iss": user.username,
    "exp": expires
  }, secretKey);
}

function approve(res, token) {
  if (!token) {
    throw 'token is not build';
  }
  res.status(202).json({
    "token": token
  });
}

function noUsernameOrPassword(res) {
  res.status(400).json({
    "message": "no username or password"
  })
}

function noUsernameOrPasswordInDB(res) {
  res.status(404).json({
    "message": "username of password is incorrect"
  });
}

function serverError(res,err) {
  const status = err.status ? err.status : 500;
  const message = "Interne server fout";

  res.status(status).json({
    "message": message
  });
}

module.exports = login;