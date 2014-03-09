'use strict';

angular.module('handsApp')
  .controller('PostedTasksCtrl', function ($scope, $http) {
    $scope.loadPostedTasks = function() {
      $scope.loadTasks({relatedBy: 'postingUser'}).success(function(tasks) {
        $scope.postedTasks = tasks;
      });
    };
    $scope.loadPostedTasks();
  });
