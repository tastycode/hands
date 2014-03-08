'use strict';

angular.module('handsApp')
  .controller('EditTaskCtrl', function ($scope, $http, $routeParams, $location) {

    function setTask(task) {
      $scope.task = task;
      $scope.autoCompletes.origin.text = task.originLocation.text;
      if (task.destLocation) {
        $scope.autoCompletes.dest.text = task.destLocation.text;
      }
      var finishBy = moment(task.finishBy);
      $scope.finishByDate = finishBy.format('MM/DD/YY');
      $scope.finishByTime = finishBy.format('h:mm a');
    }
    $scope.autoCompletes = {
      origin: {
      },
      dest: {}
    };

    $scope.autoOptions = {
      type: 'geocode',
      watchEnter: true
    };

    $scope.dayOptions = (function() {
      return _.range(0,10).map(function(i) {
        return moment().add('days', i).format('MM/DD/YY');
      });
    }());
    $scope.timeOptions = (function() {
      var minutesAfter = parseInt(moment().format('mm'));
      var minutesBeforeNextHour = 60 - minutesAfter;
      return _.range(0,24).map(function(i) {
        return moment().add('hours', i).add('minutes', minutesBeforeNextHour).format('h:mm a');
      });
    }());

    function updateFinishBy() {
      if ($scope.task) {
        $scope.task.finishBy = $scope.finishByDate + ' ' + $scope.finishByTime;
      }
    }

    $scope.$watch('finishByDate', updateFinishBy);
    $scope.$watch('finishByTime', updateFinishBy);
    $scope.$watch('autoCompletes.origin.details', function(newVal, oldVal) {
      if (newVal && newVal.geometry) {
        $scope.task.originLocation = {
          type: 'Point',
          coordinates: [newVal.geometry.location.e, newVal.geometry.location.d],
          text: $scope.autoCompletes.origin.text
        }
      }
    }, true);

    $scope.$watch('autoCompletes.dest.details', function(newVal, oldVal) {
      if (newVal && newVal.geometry) {
        $scope.task.destLocation = {
          type: 'Point',
          coordinates: [newVal.geometry.location.e, newVal.geometry.location.d],
          text: $scope.autoCompletes.dest.text
        }
      }
    }, true);

    $scope.updateTask = function() {
      $http.put('/api/tasks/' + $routeParams.id, $scope.task).success(function(task) {
        $scope.task = task;
        $location.path('/home');
      });
    };
    $scope.loadData = function() {
      $http.get('/api/tasks/' + $routeParams.id).success(function(task) {
        setTask(task);
      });
    };
    $scope.loadData();
  });
