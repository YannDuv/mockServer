'use strict';

var fs = require('fs');
var jsonServer = require('json-server');
var bodyParser = require('body-parser');
var middlewares = jsonServer.defaults();
var server = jsonServer.create();
const generatedFile = 'build/db.json';
const port = 3000;
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
  let router = jsonServer.router(__dirname +'/'+ generatedFile);

  // Set default middlewares (logger, static, cors and no-cache)
  server.use(middlewares);
  // for parsing application/json
  server.use(bodyParser.json());

  // Add custom routes before JSON Server router
  server.get('/:envCode/iphoneservice/authentication/grid', (req, res) => {
    res.sendFile(__dirname +'/public/img/grid.jpeg');
  });

  // List all the ws
  server.get('/listWs', (req, res) => {
    var results = {};
    results.get = JSON.parse(fs.readFileSync(__dirname +'/'+ generatedFile)),
    results.post = JSON.parse(fs.readFileSync(__dirname +'/api/post.json'))

    res.send(results);
  });

  // Edit requests
  server.post('/edit', (req, res) => {
    console.log(`EDIT - ${req.body.url}`);
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
    let posts = JSON.parse(fs.readFileSync(__dirname +'/api/post.json'));
    let route;

    for (var path in posts) {
      route = path.replace(/\/:[a-zA-Z0-9]*/gi, '\/[a-zA-Z0-9]*');
      if (req.url.match(route)) {
        return res.send(posts[path]);
      }
    }
  });

  // Use default router
  server.use(router);
  server.listen(port, function () {
    console.log('JSON Server is running on http://localhost:'+ port);
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
