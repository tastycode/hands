'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  appRoot: rootPath,
  sendgrid: {
    api_user: 'thomas.devol',
    api_password: 'wakeandbake'
  },
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};