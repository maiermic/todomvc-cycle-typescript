var getConfig = require('hjs-webpack');

var config = getConfig({
  in: 'src/index.ts',
  out: 'public',
  clearBeforeBuild: true,
  html: function (context) {
    return {
      'index.html': context.defaultTemplate().replace('<div id="root"></div>', '<section id="root" class="todoapp"></section><footer class="info"><p>Double-click to edit a todo</p><p><a href="https://github.com/maiermic/todomvc-cycle-typescript">Source code</a></p><p>Created by <a href="http://andre.staltz.com">Andre Staltz</a></p><p>Ported to TypeScript by <a href="https://github.com/maiermic">Michael Maier</a></p></footer>')
    }
  }
});

config.resolve.extensions = config.resolve.extensions.concat(['.ts', '.tsx']);

config.devtool = 'source-map';

module.exports = config;
