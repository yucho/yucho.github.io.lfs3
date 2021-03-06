const upath = require('upath');
const {copyDirSync} = require('./util.js');
const {renderDirSync} = require('./build.js');

copyDirSync(['src', 'static'], ['dest']);

renderDirSync();

/**
 * Hot reload (no auto refresh)
 */
const watcher = require('chokidar').watch(upath.resolve('dest'));
watcher.on('ready', () => {
  watcher.on('all', () => {
    console.log('File change detected! Clearing module cache from server');
    for (const id in require.cache) {
      if (/[\/\\]dest[\/\\]/.test(id)) delete require.cache[id];
    }
  });
});


/**
 * Run a server that serves static files
 */
const express = require('express');
const app = express();
app.use(express.static(upath.resolve('dest')));

const port = 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));


/**
 * Opens your browser automatically
 */
const open = require('open');
open(`http://localhost:${port}`);
