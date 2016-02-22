var express = require('express');
var socket = require('socket.io');
var hyperdeck = require('./hyperdeck.js');

//Start web server
var app = express();
var server = app.listen(8080);
var io = socket.listen(server);

var savedLocations = []

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('stop', function(){console.log('stop'); hyperdeck.stop();});
  socket.on('play', function(payload){console.log('play ' + payload); hyperdeck.play(payload);});
  socket.on('goto', function(payload){console.log('goto ' + payload);});
  socket.on('save', function(){console.log('save'); hyperdeck.getTimecode(saveLocation);}
  socket.on('record', function(){console.log('record'); hyperdeck.record();})
});




app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  var data = {'connected':true, 'markers':savedLocations};
  res.render('pages/index.ejs', data);
});

getTimecode(saveLocation)

function saveLocation(data){
	slotID=data.slotID
	clipID=data.clipID
	timecode=data.timecode
	savedLocations=[saveLocation+{'timecode':timecode, 'clip':clipID, 'slot':slotID}]
}