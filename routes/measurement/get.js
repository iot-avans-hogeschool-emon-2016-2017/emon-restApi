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
        "data": convertMeasurements(response.result)
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
        "data": convertDateTimeToMoment(response.result)
      });
    });
  } else {
    noDb(res);
  }
};

const getMeasurementBetweenBeginAndEndTime = function (req,res,converter) {
  getDatabase(req);

  const begin = req.body.begin;
  const end = req.body.end;

  if (!begin || !end) {inValidTime(res); return;}

  if (database) {
    database.executeQuery(buildQuery(begin, end), function (response) {
      switch(response.status) {
        case 200:
        case 204:
          var data = response.result;
          data = convertDateTimeToMoment(data);
          if (converter) {
            data = converter(data);
          }
          res.status(response.status).json({"data": data});
          break;
        default:
          res.status(response.status).json({"message":response.message})
      }
    });
  } else {
    noDb(res);
  }
};

const getTrend = function (req, res) {
    getDatabase(req);

    const queryTemplate = 'SELECT AVG(value) as value FROM (SELECT timestamp, SUM(value) as value FROM `emon-db`.measurements GROUP BY UNIX_TIMESTAMP(timestamp) DIV 3600 ) AS t1 WHERE HOUR(`timestamp`) = ';

    var responseArray = [];
    var dbResponseStatus = 0;
    if (database) {
        for (let i = 0; i < 24; i++) {
            let query = queryTemplate + i;
            database.executeQuery(query, function (response) {
                console.log(response.result);
                responseArray.push(response.result[0].value);
                if (i === 23) {
                    res.status(response.status).json({
                        "data": responseArray
                    });
                }
            });
        }
    } else {
        noDb(res);
    }
}


function getLast(req, res) {
  getDatabase(req);

  if (database) {
    database.executeQuery('SELECT * FROM measurements ORDER BY id DESC LIMIT 1', function(response) {
      switch(response.status) {
        case 200:
        case 204:
          var data = response.result;
          data = convertDateTimeToMoment(data);
          res.status(response.status).json({"data": data});
          break;
        default:
          res.status(response.status).json({"response":response})  
      }
    });
  } else {
    noDb(res);
  }
}


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

function convertDateTimeToMoment(measurements) {
  const timeKey = "timestamp";

  if (measurements.length === 0) return [];

  _.map(measurements, function (value) {
    value[timeKey] = moment(value[timeKey]).format(timeString);
  });
  return measurements;
}

function hourInterval(measurements) {
  const data = {};  
  if (measurements.length === 0) return data;
  measurements = convertDateTimeToMoment(measurements);
  
  _.forEach(measurements, function (measurement) {
    var mTime = moment(measurement['timestamp']);
    const year = mTime.year();
    const month = mTime.month()+1;
    const date = mTime.date();
    const hour = mTime.hour();

    try {
      if (!(year in data))  
        { data[year] = {}; }

      if (!(month in data[year]))
        { data[year][month] = {}; }

      if (!(date in data[year][month]))
        { data[year][month][date] = {}; }

      if (!(hour in data[year][month][date])) 
        { data[year][month][date][hour] = []; }

      data[year][month][date][hour].push(measurement);
    } catch(e) {
      console.log(year, month, date, hour, data);
      console.error(e);
    }    
  });

  return data;
}

module.exports = {
  all: all,
  byUser: byUser,
  byTime: function (req, res) {
    getMeasurementBetweenBeginAndEndTime(req,res);
  },
  byHourInterval: function (req, res) {
    getMeasurementBetweenBeginAndEndTime(req,res,hourInterval);
  },
  trend: function (req, res) {
      getTrend(req, res);
  },
  getLast: getLast
};