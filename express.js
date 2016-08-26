'use strict';

var express = require('express');
var mongoSkin = require('mongoskin');
var bodyParser = require('body-parser');
var logger = require('morgan');
var Pokedex = require('pokedex-promise-v2');
var mosca = require('mosca');

var P = new Pokedex();
var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger('dev'));

var db = mongoSkin.db('mongodb://192.168.99.100:27017', {safe:true});

app.param('collectionName', function(req, res, next, collectionName) {
  req.collection = db.collection(collectionName);
  return next();
});

app.get('/', function(req, res) {
  res.send('Choose your collection, bitch.');
});

app.get('/promise', function(req, res) {
  var age = 10;
  var sex = 'm';

  getName().then(changeName(age, sex))
           .then(applyLoan)
           .then(disburseFunds(res))
           .catch(handleError(res));
});

function getName() {
  return new Promise(function(resolve, reject) {
    var name = 'billy';
    if(!name) {
      reject();
    }
    else {
      resolve(name);
    };
  });
};

function changeName(age, sex) {
  return function(name) {
    return new Promise(function(resolve, reject) {
      if(age == 10 && sex === 'm' && name === 'billy') {
        resolve('billy bob');
      }
      else {
        reject();
      };
    });
  };
};

function applyLoan(newName) {
  return new Promise(function(resolve, reject) {
    if(newName === 'billy bob') {
      resolve();
    }
    else {
      reject();
    };
  });
};

function disburseFunds(res) {
    return new Promise(function(resolve, reject) {
      res.status(200);
      res.send('Take your money bitch');
      res.end();
      resolve();
    });
};

function handleError(res) {
  return function() {
    res.status(500);
    res.end();
  }
};


app.get('/collection/:collectionName', function(req, res, next) {
  var data = req.collection.find({}, {limit:100, sort:{_id:-1}}).toArray(function(e, results) {
    if(e) {
      return next(e);
    }
    else {
      res.send(results);
    };
  });
});

app.post('/collection/:collectionName', function(req, res, next) {
  req.collection.insert(req.body, {}, function(e, results) {
    if(e) {
      return next(e);
    }
    else {
      res.status(201);
      res.send(results);
      res.end();
    };
  });
});

app.get('/pokemon/:name', function(req, res, next) {
  let name = req.params.name;
  P.getPokemonByName(name)
  .then(function(response) {
    res.status(200);
    res.send(response);
  })
  .catch(function(error) {
    res.status(500);
    res.end();
  });
});

var socketServer = require('express')();
var http = require('http').Server(socketServer);
var io = require('socket.io')(http);

io.on('connect', function (socket) {
  console.log('Connected '+socket.conn);
});

io.on('disconnect', function (socket) {
  console.log('Disconnected '+socket.conn);
});

var settings = {
  port: 1883,
  persistence: mosca.persistence.Memory
};

var server = new mosca.Server(settings, function() {
  console.log('Mosca server is up and running')
});

server.published = function(packet, client, cb) {
  if (packet.topic.indexOf('echo') === 0) {
    return cb();
  }

  var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload,
    retain: packet.retain,
    qos: packet.qos
  };

  console.log('newPacket', newPacket);

  server.publish(newPacket, cb);
};

http.listen(3000, function() {
  console.log('Socket Server running on port 3000');
});

app.listen(8080, function() {
  console.log('Server is running on port 8080');
});

module.exports = app;
