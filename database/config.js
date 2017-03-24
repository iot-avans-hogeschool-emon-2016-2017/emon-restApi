const env = process.env.NODE_ENV;

if (env === "development") {
  configObject = require('./dev.json');
} else {
  configObject = require('./prod.json');
}

module.exports = configObject;