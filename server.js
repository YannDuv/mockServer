'use strict';

var fs = require('fs');
var jsonServer = require('json-server');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const middlewares = jsonServer.defaults();
const server = jsonServer.create();
const generatedFile = 'build/db.json';
const port = 3000;
const dbPort = 27017;
const dbAddress = 'localhost';
const dbAuthentication = 'mongodb://';
const jsonFiles =  [
  'authentication.json',
  'profile/1-user.json',
  'profile/2-accounts.json',
  'profile/3-profiles.json',
  'profile/4-virtualOperations.json',
  'profile/5-agency.json',
  'profile/6-ghostAccount.json',
  'profile/7-projects.json',
  'profile/8-rendezVous.json',
  'profile/9-messages.json',
  'schedule.json',
  'requests.json'
];

var Api = require('./app/models/api.model.js').Api;

mongoose.connect(dbAuthentication + dbAddress +':'+ dbPort +'/mock');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.info('MongoDB fonctionne correctement.');
});

function mergeJSON(a, b) {
  for (let z in b) {
    a[z] = b[z];
  }
  return a;
}

function mergeJSONs(arr) {
  console.info(`Reading ${arr[0]}...`);
  let result = JSON.parse(fs.readFileSync(__dirname +'/api/'+ arr[0]));

  for (let i=1; i<arr.length; i++) {
    console.info(`Reading ${arr[i]}...`);
    result = mergeJSON(result, JSON.parse(fs.readFileSync(__dirname +'/api/'+ arr[i])));
  }
  return result;
}

function initServer() {
  //let router = jsonServer.router(__dirname +'/'+ generatedFile);

  // Set default middlewares (logger, static, cors and no-cache)
  server.use(middlewares);
  // for parsing application/json
  server.use(bodyParser.json());

  // Add custom routes before JSON Server router
  server.get('/:envCode/iphoneservice/authentication/grid', (req, res) => {
    res.sendFile(__dirname +'/public/img/grid.jpeg');
  });

  // List all the ws
  server.get('/WSlist', (req, res) => {
    Api.find({}, (err, results) => {
      res.send(results);
    });
  });

  // Edit requests
  server.post('/WSedit', (req, res) => {
    console.info(`EDIT - ${req.body.url}`);
    let fileToEdit;

    if (req.body.method === 'POST') {
      fileToEdit = __dirname +'/api/post.json';
    } else {
      fileToEdit = __dirname +'/'+ generatedFile;
    }
    let apiList = JSON.parse(fs.readFileSync(fileToEdit));

    apiList[req.body.url] = req.body.res;

    fs.writeFile(fileToEdit, JSON.stringify(apiList), (err) => {
      if(err) {
        console.error(err);
      } else {
        res.send('Everything is awesome !');
      }
    });
  });

  // Manage post requests
  server.post('/*', (req, res) => {
    mockResponse(req, res, 'POST');
  });

  // Manage get requests
  server.get('/*', (req, res) => {
    mockResponse(req, res, 'GET');
  });

  // Use default router
  //server.use(router);
  server.listen(port, function () {
    console.info('JSON Server is running on http://localhost:'+ port);
  });

  initDB();
}

function mockResponse(req, res, method) {
  Api.find({method: method}, (err, apis) => {
    let route;
    let api;

    if (err) {
      console.error(err); res.status(500);
    }

    for (var i=0; i<apis.length; i++) {
      api = apis[i];
      route = api.url.replace(/\/:[a-zA-Z0-9]*/gi, '\/[a-zA-Z0-9\-]*');
      console.log(route, req.url, req.url.match(route));
      if (req.url.match(route)) {
        return res.status(api.status).send(api.response);
      }
    }
    res.status(404).send();
  });
}

function initDBFor(fileName, method) {
  let apis = JSON.parse(fs.readFileSync(__dirname + fileName));
  let api;

  for (var post in apis) {
    api = new Api();
    api.url = post;
    api.method = method;
    api.response = JSON.stringify(apis[post]);
    api.save((err) => {
      if (err) console.error(err);
    })
  }
}

function initDB() {
  Api.find((err, apis) => {
    if (!apis.length) {

      initDBFor('/api/post.json', 'POST');
      initDBFor('/'+ generatedFile, 'GET');
      console.info('db initialized');
    }
  });
}

// Check if build folder exists
fs.access('build/db.json', fs.W_OK, (err) => {
  if (err) {

    // If not, create one
    fs.mkdir('build', (err) => {

      // Then, build the generatedFile with all the get API
      fs.writeFile(generatedFile, JSON.stringify(mergeJSONs(jsonFiles)), (err) => {
        if(err) {
          console.error(err);
        } else {
          initServer();
        }
      });
    });

  } else {
    initServer();
  }
});
