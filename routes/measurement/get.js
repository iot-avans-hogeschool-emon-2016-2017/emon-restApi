module.exports = function (req, res) {
  const user = req.app.get('user');

  res.status(200).json({
    "message": "measurement get route, ask by user: "+user.username
  })
};