# Json-server mock - CA maBanque

## Install
Requires :
* nodeJs v4 or more
* grunt ==> _npm install -g grunt-cli_
* bower ==> _npm install -g bower_
bascule

Terminal :
```
npm install -g json-server
npm install
bower install
```

## Run
```
cd my_path
grunt
```

## Answer with a file
Check the exemple of **/:envCode/iphoneservice/authentication/grid**

## Sources
https://github.com/typicode/json-server

## Docker
```
sudo docker build -t yann/mock-server:25-08-2016 --no-cache --rm=true .
sudo docker tag yann/mock-server:25-08-2016 192.168.2.31:5000/yann/mock-server:25-08-2016
sudo docker push 192.168.2.31:5000/yann/mock-server:25-08-2016
```

## Contact
**yann.duval@backelite.com**
