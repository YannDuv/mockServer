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
    enum: ['POST', 'GET', 'PUT', 'DELETE'],
    default: 'GET'
  },
  status: {
    type: Number,
    enum: [
      200,  // ok
      400,  // bad request
      401,  // unauthorized
      403,  // forbidden
      404,  // not found
      500   //internal server error
    ],
    default: 200
  },
  response: {
    type: String
  }
});

exports.Api = mongoose.model('Api', apiSchema);
