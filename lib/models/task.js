'use strict';

var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var TaskSchema = new Schema({
  type: { type: String, default: 'delivery'},
  title: String,
  details: String,
  originLocation: { type: {type: String, default: 'Point'}, coordinates: [], text: String},
  destLocation: { type: {type: String, default: 'Point'}, coordinates: [], text: String},
  status: { type: String, default: 'available'},
  tags: [ {type: String} ],
  postingUser: { type: Schema.ObjectId, ref: 'User' },
  claimedUser: { type: Schema.ObjectId, ref: 'User' },
  finishBy: Date,
});

TaskSchema.index({originLocation: '2dsphere'});

TaskSchema.plugin(timestamps)

mongoose.model('Task', TaskSchema);
