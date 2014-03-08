'use strict';

angular.module('handsApp')
  .controller('AvailableTasksCtrl', function ($scope, $http) {
    $scope.loadData = function() {
      $http.get('/api/tasks/nearby?status=available').success(function(tasks) {
        $scope.availableTasks = tasks;
      });
    };

    $scope.loadData();
  });
