'use strict';

angular.module('handsApp')
  .controller('AvailableTasksCtrl', function ($scope, $http) {
    $scope.loadAvailable = function() {
      $http.get('/api/tasks/nearby?status=available').success(function(tasks) {
        $scope.availableTasks = tasks;
      });
    };
    $scope.claim = function(task) {
      task.status = 'claimed';
      $http.put('/api/tasks/' + task._id, task).success(function(task) {
        $scope.reloadTasks();
      });
    };

    $scope.$on('loadTasks', function() {
      $scope.loadAvailable();
    });

    $scope.loadAvailable();
  });
