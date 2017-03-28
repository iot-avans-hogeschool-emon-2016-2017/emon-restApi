var jwt = require('jwt-simple');
var moment = require('moment');
var database = require('../database');
console.log(database);
/*
* Login function is case sensitive
* default login is admin, admin*/


const login = function (req, res) {
  const reqUsername = req.body.username || '';
  const reqPassword = req.body.password || '';

  if (reqUsername === '' || reqPassword === '') {
    noUsernameOrPassword(res);
    return;
  }

  database.executeQuery('select * from users', function (result) {
    console.log('users:', result);
  });

  const dbUsername = req.app.get('username');
  const dbPassword = req.app.get('password');

  /*@TODO check for username and password in database*/
  if ((reqUsername === dbUsername) && (reqPassword === dbPassword)) {

    //token is valid for 10 days
    const expires = moment().add(10, 'days');

    const token = jwt.encode({
      "iss": reqUsername,
      "exp": expires
    }, req.app.get('secretKey'));
    approve(res, token);

  } else {
    noUsernameOrPasswordInDB(res);
  }
};

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