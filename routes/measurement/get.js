var moment = require('moment');
var _ = require('lodash');
var database = null;

const timeString = "YYYY-MM-DD HH:mm:ss";

function getDatabase(req) {
  if (!database) database = req.app.get('db');
}

const all = function (req, res) {
  getDatabase(req);

  if (database) {
    database.executeQuery('select * from measurements', function (response) {
      res.status(response.status).json({
        "result": convertMeasurements(response.result)
      });
    });
  } else {
    noDb(res);
  }
};

const byUser = function (req, res) {
  getDatabase(req);
  const id = req.params['id'];

  if (!id || id < 0) {noUserId(res); return; }

  if (database) {
    database.executeQuery('SELECT * FROM measurements WHERE users_id = '+id, function (response) {
      res.status(response.status).json({
        "data": convertMeasurements(response.result)
      });
    });
  } else {
    noDb(res);
  }
};

const byBeginAndEndTime = function (req, res) {
  getDatabase(req);

  const begin = req.body.begin;
  const end = req.body.end;

  if (!begin || !end) {inValidTime(res); return;}

  if (database) {
    database.executeQuery(buildQuery(begin, end), function (response) {
      switch(response.status) {
        case 200:
        case 204:
          res.status(response.status).json({"data": convertMeasurements(response.result)});
          break;
        default:
          res.status(response.status).json({"message":response.message})
      }
    });
  } else {
    noDb(res);
  }
};

function buildQuery(begin, end) {
  function quote(key) {
    return "'"+key+"'";
  }

  const query = [
    "SELECT * FROM measurements WHERE timestamp >=",
    quote(begin),
    "AND timestamp <=",
    quote(end)
  ];

  return _.join(query, " ");
}

function noUserId(res) {
  res.status(400).json({
    "message":"invalid user id"
  });
}

function noDb(res) {
  res.status(500).json({
    "message":"no database connected"
  });
}

function inValidTime(res) {
  res.status(400).json({
    "message": "invalid times"
  });
}

function convertMeasurements(measurements) {
  const timeKey = "timestamp";

  if (measurements.length === 0) return [];

  _.map(measurements, function (value) {
    value[timeKey] = moment(value[timeKey]).format(timeString);
  });
  return measurements;
}

module.exports = {
  all: all,
  byUser: byUser,
  byTime: byBeginAndEndTime
};