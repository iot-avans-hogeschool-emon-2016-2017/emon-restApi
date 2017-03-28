var mysql = require('mysql');
const config = require('./config');
var exports = module.exports = {};

const makeConnection = function () {
  return mysql.createConnection(config);
};

exports.executeQuery = function (query, callback_results) {
  const connection = makeConnection();

  connection.query(query, function (err, results) {
    if (err) {
      console.log(err);
      sendResult(failedQuery(err));
    } else {
      sendResult(successQuery(results));
    }
  });

  function sendResult(results) {
    if (typeof callback_results !== "undefined") {
      results = JSON.parse(JSON.stringify(results));

      callback_results(results);
    }
  }

  connection.end();
};

const failedQuery = function (err) {
  return {
    "status": 400,
    "result":err
  };
};

const successQuery = function (results) {
  return {
    "status": 200,
    "result": results
  }
};


