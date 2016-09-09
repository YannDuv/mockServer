'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: 'This project name is already used.'
  },
  key: {
    type: String,
    required: true,
    unique: 'This key name is already used.'
  }
});

exports.Project = mongoose.model('Project', projectSchema);
