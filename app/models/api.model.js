'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var apiSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['POST', 'GET', 'PUT', 'DELETE', 'PATCH'],
    default: 'GET'
  },
  status: {
    type: Number,
    enum: [
      200,  // ok
      201,  // create
      400,  // bad request
      401,  // unauthorized
      403,  // forbidden
      404,  // not found
      500   // internal server error
    ],
    default: 200
  },
  response: String,
  project: {
    type: Schema.ObjectId,
    ref: 'Project'
  },
  cookies: [{
    name: String,
    value: String,
    options: Schema.Types.Mixed
  }]
});

exports.Api = mongoose.model('Api', apiSchema);
