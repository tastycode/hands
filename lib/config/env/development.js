'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  env: 'development',
  appRoot: rootPath + '/app',
  mongo: {
    uri: 'mongodb://localhost/hands-dev'
  }
};
