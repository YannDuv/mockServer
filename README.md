# Json-server mock - CA maBanque

## Install
Requires :
* nodeJs v4 or more
* grunt ==> _npm install -g grunt-cli_
* bower ==> _npm install -g bower_

Terminal :
```
npm install -g json-server
npm install
bower install
```

## Run
```
cd my_path
node server.js
```

## Add a new get web service
Open the file *api/requests.json*.

There, add a new property to the json file with the name of the url of your web service.

As a value, put the mocked result that you have.

Finally, restart the server.

## Answer with a file
Check the exemple of **/:envCode/iphoneservice/authentication/grid**

## Sources
https://github.com/typicode/json-server

## Contact
**yann.duval@backelite.com**
