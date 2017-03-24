var mysql = require('mysql');
const config = require('./config');

const connection = mysql.createConnection(config);

connection.connect();

connection.query('select * from measurements', function (err, results, fields) {
  if (err) {
    console.log(err);
    throw err;
  }

  console.log(results, "---------\n", fields);
});

connection.end();
