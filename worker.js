'use strict';


/* common init { */
var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

/* } */

var Agenda = require('agenda'),
    agenda = new Agenda({db: { address: config.mongo.uri } }),
    sendgrid = require('sendgrid')(config.sendgrid.api_user, config.sendgrid.api_password),
    Email = sendgrid.Email,
    Handlebars = require('handlebars'),
    premailer = require('premailer-api'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Task = mongoose.model('Task'),
    Q = require('q'),
    _ = require('lodash')._;

agenda.define('notify volunteers', function(job, done) {
  var jobData = job.attrs.data;
  Task.findById(jobData.id).populate('postingUser').exec().then(function(task) {
    User.nearTo(task.originLocation, {roleTags: {$in: ['volunteer']}}, 10).then(function(users){
      users.forEach(function(user) {
        console.log('Notifying Volunteer:', user.email, ' for task ', task.title);
        var templateTask = _.pick(task, 'kind', 'location');
        templateTask.postingUser = _.pick(pickup.postingUser, 'name', 'phone', 'location');
        agenda.schedule('now', 'send email', {
          to: user.email,
          subject: 'New Task: ' + pickup.kind,
          templateName: 'task_request',
          pickup: templateTask
        });
      });
      done();
    }, function(error) { console.log('notify couriers error', error)});
  });
});


agenda.define('notify poster', function(job, done) {
  var jobData = job.attrs.data;
  Task.findById(jobData.id).populate('postingUser claimedUser').exec().then(function(task) {
      console.log('Notifying Poster: ', task.postingUser.email, ' for task ', task.title);
      var templateTask = _.pick(task, 'title', 'status', 'details', 'originLocation', 'destLocation', 'finishBy');

      if (task.claimedUser) {
        templateTask.claimedUser = _.pick(task.claimedUser, 'name', 'phone', 'location');
      }

      agenda.schedule('now', 'send email', {
        to: task.postingUser.email,
        subject: 'Update for: ' + task.title,
        templateName: 'poster_update',
        task: templateTask
      });

      done();
  });
});

agenda.define('send email', function(job, done) {
  var jobEmail = job.attrs.data;
  console.log('Sending Email:', jobEmail);

  var headerHtml = fs.readFileSync(config.appRoot + '/views/emails/header.html', 'utf8');
  var footerHtml = fs.readFileSync(config.appRoot + '/views/emails/footer.html', 'utf8');
  var templateHtml = fs.readFileSync(config.appRoot + '/views/emails/' + jobEmail.templateName + '.html', 'utf8');
  var template = Handlebars.compile(headerHtml + templateHtml + footerHtml);
  var emailHtml = template(jobEmail);

  premailer.prepare({html: emailHtml}, function(err, email) {

    var email = new Email({
      to: jobEmail.to,
      from: 'noreply@gethands.org',
      subject: jobEmail.subject,
      html: email.html
    });

    sendgrid.send(email, function(err, json) {
      if (err) {
        console.log('Could not send email to ', email.to, ' with subject', email.subject, 'for templateName', jobEmail.templateName);
      } else {
        console.log('Sent email to ', email.to, ' with subject', email.subject, 'for templateName', jobEmail.templateName);
        console.log(json);
      }
      done();
    });
  });
});

agenda.start();
