var express = require('express');
var socket = require('socket.io');
var Hyperdeck = require('./hyperdeck/hyperdeck.js');

//Stuff
var hyperdeck = new Hyperdeck("192.168.72.60");

var savedLocations = require("./markers.json");
var fs = require("fs");

//Start web server
var app = express();
var server = app.listen(8080);
var io = socket.listen(server);


function writeMarkers(data) {
    var str = JSON.stringify(data);
    fs.writeFile("./markers.json", str, function(err) {
        if (err) {
            return err;
        }
    });
}

function deleteLocation(data) {
    savedLocations.splice(data, 1);
    console.log(savedLocations);
    io.emit("savedLocations", savedLocations);
    writeMarkers(savedLocations);
}

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('stop', function() {
    console.log('stop');
    hyperdeck.stop();
  });
  socket.on('play', function(payload) {
    console.log('play ' + payload);
    hyperdeck.play(payload);
  });
  socket.on('goto', function(payload) {
    console.log('goto ' + payload);
    hyperdeck.goto(payload);
  });
  socket.on('save', function() {
    console.log('save');
    hyperdeck.getTimecode();
  });
  socket.on('record', function() {
    console.log('Recording');
    hyperdeck.record();
  });
  socket.on('delete', function(ref) {
    deleteLocation(ref);
  });
  socket.on('getTransportInfo', function() {
    hyperdeck.getTransportInfo();
  });

});




app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  var data = {
    'connected': true,
    'markers': savedLocations
  };
  res.render('pages/index.ejs', data);
});

//hyperdeck.getTimecodeInfo();
//hyperdeck.dataEmitter.on('transport', saveLocation);

/*
function saveLocation(data) {
  var slotID = data.slotID,
      clipID = data.clipID,
      timecode = data.timecode;
  savedLocations.push({
    'timecode': timecode,
    'clip': clipID,
    'slot': slotID
  });
  console.log(savedLocations);
  io.emit("savedLocations", savedLocations);
  writeMarkers(savedLocations);
}

function writeMarkers(data) {
  var str = JSON.stringify(data);
  fs.writeFile("./markers.json", str, function(err) {
    if (err) return err;
  });
}*/
