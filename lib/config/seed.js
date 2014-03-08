'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * Populate database with seed data
 */
// Clear old users, then add a default user
User.findOne({email: 'komalahmad786@gmail.com'}).exec(function(err, user) {
  if (user) {
    return;
  }
  User.create({
    provider: 'local',
    firstName: 'Komal',
    lastName: 'Ahmad',
    name: 'Feeding Forward',
    email: 'komalahmad786@gmail.com',
    role: 'admin',
    roleTags: ['poster'],
    password: 'feedingforward'
  }, function() {
      console.log('finished populating users');
    }
  );
});
