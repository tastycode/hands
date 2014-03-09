'use strict';

angular.module('handsApp')
  .controller('ShowTaskCtrl', function ($scope, $http, $routeParams) {
    $scope.loadData = function() {
      $http.get('/api/tasks/' + $routeParams.id).success(function(task) {
        $scope.task = task;
      });
    };
    $scope.loadData();
  });
