'use strict';

var express = require('express');
var mongoSkin = require('mongoskin');
var bodyParser = require('body-parser');
var logger = require('morgan');
var Pokedex = require('pokedex-promise-v2');

var P = new Pokedex();
var app = express();

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

// app.put('/collection/:collectionName/:id', function(req, res, next) {
//   req.collection.updateById({_id:req.param.id}, {$set:req.body}, {safe:true, multi:false}, function(e, results) {
//     if(e) {
//       return next(e);
//     }
//     else {
//       res.send(results === 1 ? {message:"success"} : {message:"failure"});
//       res.end();
//     };
//   });
// });


app.get('/pokemon/:name', function(req, res, next) {
  let name = req.params.name;
  P.getPokemonByName(name)
  .then(function(response) {
    //console.log(response);
    res.status(200);
    res.send(response);
  })
  .catch(function(error) {
    console.log('There was an ERROR: ', error);
    res.status(500);
    res.end();
  });
});

app.listen(8080, function() {
  console.log("Server is running on port 8080");
});
