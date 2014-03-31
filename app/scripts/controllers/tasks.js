'use strict';
angular.module('handsApp').controller('TasksCtrl', function ($scope, $http, $location) {
    $scope.task = {};

    $scope.go = function (path) {
        $location.path(path);
    };

    $scope.loadTasks = function (options) {
        return $http.get('/api/tasks', { params: options });
    };

    $scope.reloadTasks = function () {
        $scope.$broadcast('loadTasks');
    };

    $scope.createTask = function () {
        $http.post('/api/tasks', $scope.newTask).success(function (task) {
            $scope.loadPostedTasks();
        });
    };

    $scope.update = function (task) {
        $location.path('/tasks/' + task._id + '/edit');
    };
    $scope.view = function (task) {
        $location.path('/tasks/' + task._id);
    };

    $scope.cancel = function (task) {
        task.status = 'canceled';
        $http.put('/api/tasks/' + task._id, task).success(function (task) {
            $scope.loadPostedTasks();
        });
    };

    $scope.complete = function (task) {
        task.status = 'completed';
        $http.put('/api/tasks/' + task._id, task).success(function (task) {
            $scope.loadClaimedTasks();
        });
    };
});
//# sourceMappingURL=tasks.js.map
