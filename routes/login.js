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

  database.executeQuery('select * from users', function (users) {
    console.log(userN, passW, 'users:', users);
    const user = _.find(users.result,{'username':userN, 'password': passW});
    console.log(user);

    if (user && typeof user !== 'undefined') {
      const token = buildToken(user, req.app.get('secretKey'));
      approve(res, token);
    } else {
      noUsernameOrPasswordInDB(res);
    }
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

module.exports = login;