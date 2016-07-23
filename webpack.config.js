var getConfig = require('hjs-webpack');

var config = getConfig({
  in: 'src/index.ts',
  out: 'public',
  clearBeforeBuild: true
});

module.exports = config;
