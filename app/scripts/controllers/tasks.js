'use strict';

angular.module('handsApp')
  .controller('TasksCtrl', function ($scope, $http, $location) {
    $scope.task = {};

    function loadTasks(options) {
      return $http.get('/api/tasks', {params: options});
    };

    $scope.loadClaimedTasks = function() {
      loadTasks({relatedBy: 'claimedUser'}).success(function(tasks) {
        $scope.claimedTasks = tasks;
      });
    };

    $scope.loadPostedTasks = function() {
      loadTasks({relatedBy: 'postingUser'}).success(function(tasks) {
        $scope.postedTasks = tasks;
      });
    };

    $scope.createTask = function() {
      $http.post('/api/tasks', $scope.newTask).success(function(task) {
        $scope.loadPostedTasks();
      });
    };

    $scope.update = function(task) {
      $location.path('/tasks/' + task._id + '/edit');
    };
    
    $scope.view = function(task) {
      $location.path('/tasks/' + task._id);
    };

    $scope.cancel = function(task) {
      task.status = 'canceled';
      $http.put('/api/tasks/' + task._id, task).success(function(task) {
        $scope.loadPostedTasks();
      });
    };

    $scope.loadPostedTasks();
    $scope.loadClaimedTasks();

  });
