const measurement = function(req, res) {
  console.log('post measurement');

  res.status(201).json({
    "message": "measurement is posted"
  });
};

module.exports = measurement;