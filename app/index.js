var express = require('express');
var socket = require('socket.io');

//Start web server
var app = express();
var server = app.listen(8080);
var io = socket.listen(server);

io.on('connection', function(socket){
  console.log('a user connected');});


app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  var data = {connected:true, markers:[{timecode:'1234'},{timecode:'123456'}]
  };
  res.render('pages/index.ejs', data);
});
