const measurement = function(req, res) {
  const userId =    req.app.get('userId');
  const timestamp = req.body.timestamp  || '';
  const value =     req.body.value      || '';
  const location =  req.body.location   || '';

  if (!userId || !timestamp || !value) {
    badPost(res);
    return;
  }

  //object to send to database
  const measurement = {
    "users_id": userId,
    "timestamp": timestamp,
    "location": location,
    "value": value
  };

  /*@TODO send measurement to database*/

  res.status(201).json({
    "message": "measurement is posted"
  });
};

function badPost(res) {
  res.status(400).json({
    "message": "missing content"
  })
}

module.exports = measurement;