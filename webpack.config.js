var getConfig = require('hjs-webpack');

var config = getConfig({
  in: 'src/index.js',
  out: 'public',
  clearBeforeBuild: true
});

module.exports = config;
