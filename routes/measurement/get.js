var database = null;

function getDatabase(req) {
  if (!database) database = req.app.get('db');
}

const all = function (req, res) {
  getDatabase(req);

  if (database) {
    database.executeQuery('select * from measurements', function (response) {
      res.status(response.status).json({
        "result":response.result
      });
    });
  } else {
    res.status(500).json({
      "message":"no database connected"
    });
  }
};

const byUser = function (req, res) {
  getDatabase(req);
  const id = req.params['id'];

  if (!id || id < 0) {noUserId(res); return; }

  if (database) {
    database.executeQuery('select * from measurements where users_id = '+id, function (response) {
      res.status(response.status).json({
        "result": response.result
      });
    });
  } else {
    res.status(500).json({
      "message":"no database connected"
    });
  }
};

function noUserId(res) {
  res.status(400).json({
    "message":"invalid user id"
  });
}



module.exports = {
  all: all,
  byUser: byUser
};