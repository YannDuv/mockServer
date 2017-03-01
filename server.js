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
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app = require('./app')(app);

app.listen(port, function () {
  console.info('JSON Server is running on http://localhost:'+ port);
});
