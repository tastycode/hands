'use strict';

angular.module('handsApp')
  .controller('ClaimedTasksCtrl', function ($scope, $http) {
    $scope.loadClaimedTasks = function() {
      $scope.loadTasks({relatedBy: 'claimedUser'}).success(function(tasks) {
        $scope.claimedTasks = tasks;
      });
    };
    $scope.$on('loadTasks', function() {
      $scope.loadClaimedTasks();
    });
    $scope.loadClaimedTasks();
  });
