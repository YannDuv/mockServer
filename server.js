'use strict';

let jsonServer = require('json-server');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

const middlewares = jsonServer.defaults();
let server = jsonServer.create();
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

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// for parsing application/json
server.use(bodyParser.json());

server = require('./app')(server);

server.listen(port, function () {
  console.info('JSON Server is running on http://localhost:'+ port);
});
