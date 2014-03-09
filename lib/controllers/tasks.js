var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var Q = require('q');
var _ = require('lodash')._;


exports.create = function(req, res) {
  var task = new Task(req.body);
  task.postingUser = req.user.id;
  task.save(function(err, task) {
    console.log(err);
    res.send(task);
  });
}

exports.show = function(req, res) {
  Task.findById(req.params.id).exec().then(function(task) {
    res.send(task);
  });
}

exports.nearby = function(req, res) {
  console.log('req.user.nearbyTasks');
  req.user.nearbyTasks(10).then(function(tasks) {
      res.send(tasks);
  }, function(error) {
    console.log('error from mongo', error);
  });
};

exports.index = function(req, res) {
  var find = {};

  if (!req.query.showCanceled) {
    find.status = {$ne: 'canceled'};
  }

  if (req.query.relatedBy) {
    find[req.query.relatedBy] = req.user._id;
  }

  if (req.query.relatedBy === 'claimedUser') {
    find.status = 'claimed';
  }

  Task.find(find).exec().then(function(tasks) {
    res.send(tasks);
  });
}

exports.update = function(req, res) {
  Task.findById(req.params.id).exec().then(function(task) {
    task.set(req.body);
    if (task.status === 'claimed') {
      task.claimedUser = req.user._id;
    }
    task.save(function(err, task) {
      res.send(task);
    });
  });
}
