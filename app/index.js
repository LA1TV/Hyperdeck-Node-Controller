var express = require('express');
var socket = require('socket.io');
var hyperdeck = require('./hyperdeck.js')

//Start web server
var app = express();
var server = app.listen(8080);
var io = socket.listen(server);

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('stop', function(){console.log('stop'); hyperdeck.stop()});
  socket.on('play', function(payload){console.log('play ' + payload); hyperdeck.play(payload)});
  socket.on('goto', function(payload){console.log('goto ' + payload);});
});




app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  var data = {connected:true, markers:[{timecode:'1234'},{timecode:'123456'}]
  };
  res.render('pages/index.ejs', data);
});

hyperdeck.play(100);
