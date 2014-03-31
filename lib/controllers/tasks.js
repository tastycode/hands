var mongoose = require('mongoose');
var Task = mongoose.model('Task');
var Q = require('q');
var _ = require('lodash')._;
var config = require('./../config/config');
var Agenda = require('agenda');
var agenda = new Agenda({db: { address: config.mongo.uri } });


exports.create = function(req, res) {
  var task = new Task(req.body);
  task.postingUser = req.user.id;
  task.save(function(err, task) {
    agenda.schedule('now', 'notify volunteers', {
      id: task._id
    });
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
    if (task.status !== req.body.status) {
      agenda.schedule('now', 'notify poster', {
        id: task._id
      });
    }
    task.set(req.body);
    if (task.status === 'claimed') {
      task.claimedUser = req.user._id;
    }
    task.save(function(err, task) {
      res.send(task);
    });
  });
}
