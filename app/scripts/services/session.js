'use strict';

angular.module('handsApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
