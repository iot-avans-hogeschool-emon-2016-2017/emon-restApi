var jwt = require('jwt-simple');
var moment = require('moment');

/*
* Login function is case sensitive
* default login is admin, admin*/


const login = function (req, res) {

  const reqUsername = req.body.username || '';
  const reqPassword = req.body.password || '';

  if (reqUsername == '' || reqPassword == '') {
    baseRequest(res);
    return;
  }

  const dbUsername = req.app.get('username');
  const dbPassword = req.app.get('password');

  //function looks in db and checks if username and password are in the database
  if ((reqUsername == dbUsername) && (reqPassword == dbPassword)) {

    //token is valid for 10 days
    const expires = moment().add(10, 'days');

    const token = jwt.encode({
      "iss": reqUsername,
      "exp": expires
    }, req.app.get('secretKey'));
    approve(res, token);

  } else {
    badRequest(res);
  }
};

function approve(res, token) {
  if (!token) {
    throw 'token is not set';
  }
  res.status(202).json({
    "token": token
  });
}

function badRequest(res) {
  res.status(400).json({
    "status": 400,
    "message": "Unknown USER, bye"
  });
}

module.exports = login;