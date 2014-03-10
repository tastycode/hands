'use strict';

angular.module('handsApp')
  .controller('MainCtrl', function ($scope, $http, $location) {
    $scope.go = function(path) {
      $location.path(path);
    };
  });
