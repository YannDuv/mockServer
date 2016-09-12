'use strict';

const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');

// Use native promises
mongoose.Promise = global.Promise;

const middlewares = jsonServer.defaults();
const port = 3000;
const dbPort = 27017;
const dbAuthentication = 'mongodb://';

// For docker
const dbAddress = process.env.environment === 'dev' ? 'localhost' : 'database';

mongoose.connect(dbAuthentication + dbAddress +':'+ dbPort +'/mock');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.info('MongoDB fonctionne correctement.');
});

let server = jsonServer.create();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

server.use(bodyParser.json());
server.use(cookieParser('shhhh, very secret'));

server = require('./app')(server);

server.listen(port, function () {
  console.info('JSON Server is running on http://localhost:'+ port);
});
