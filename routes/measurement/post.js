var database = null;
var _ = require('lodash');

// const measurement = function(req, res) {
module.exports = function(req, res) {
  database = req.app.get('db');

  const userId =    req.app.get('user').id;
  const timestamp = req.body.timestamp  || '';
  const value =     req.body.value      || '';
  const location =  req.body.location   || '';

  if (!userId || !timestamp || !value) {
    failurePost(res);
    return;
  }

  const measurement = {
    "users_id": userId,
    "timestamp": timestamp,
    "location": location,
    "value": value
  };

  addMeasurementToDatabase(measurement, function (response) {
    if (response.status === 200) {
      successPost(res)
    } else {
      failurePost(res);
    }
  });
};

function addMeasurementToDatabase(measurement, callback) {
  const query = buildQuery(measurement);

  if (!database || database === null || database === undefined) {
    if (callback) callback({"status":500,"message":"no database connected to call"});
    return;
  }


  database.executeQuery(query, function (response) {
    if (callback) callback(response);
  });
}

function buildQuery(measurement) {
  var query = {
    prefix_keys: 'INSERT INTO measurements',
    keys: [],
    prefix_values: 'VALUES',
    values: []
  };

  _.mapKeys(measurement, function (value, key) {
    if (!!value) {
      query.keys.push(key);
      query.values.push(value);
    }
  });

  query.keys =   "("+_.join(query.keys,   ", ")+")";
  query.values = "("+_.join(_.map(query.values, quote), ", ")+")";

  function quote(key) {
    if (_.isNumber(key)) return key;

    return "'"+key+"'";
  }

  query = _.join(_.values(query), " ");

  return query;
}

function failurePost(res) {
  res.status(400).json({
    "message": "posting measurement went wrong"
  })
}

function successPost(res) {
  res.status(200).json({
    "message": "posting measurement went well"
  });
}
