'use strict';

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');

// Use native promises
mongoose.Promise = global.Promise;

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

let app = express();
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(cookieParser('shhhh, very secret'));

// CORS allowed
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

app = require('./app')(app);

app.listen(port, function () {
  console.info('JSON Server is running on http://localhost:'+ port);
});
