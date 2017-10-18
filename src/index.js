var express = require('express')
var socket = require('socket.io')
var HyperdeckLib = require('hyperdeck-js-lib')
var timecode = require('timecode').Timecode

// Stuff
var hyperdeck = new HyperdeckLib.Hyperdeck('192.168.72.61')

var savedLocations = require('./markers.json')
var fs = require('fs')

// Start web server
var app = express()
var server = app.listen(8080)
var io = socket.listen(server)

function writeMarkers (data) {
  var str = JSON.stringify(data)
  fs.writeFile('./markers.json', str, function (err) {
    if (err) {
      return err
    }
  })
}

function saveLocation (data) {
  var slotID = data.params['slot id']
  var clipID = data.params['clip id']
  var timecode = data.params.timecode

  savedLocations.push({
    'timecode': timecode,
    'clip': clipID,
    'slot': slotID
  })
  console.log(savedLocations)
  io.emit('markers', savedLocations)
  writeMarkers(savedLocations)
}

function deleteLocation (data) {
  savedLocations.splice(data, 1)
  console.log(savedLocations)
  io.emit('markers', savedLocations)
  writeMarkers(savedLocations)
}

io.on('connection', function (socket) {
  console.log('a user connected')
  socket.on('stop', function () {
    console.log('stop')
    hyperdeck.stop()
  })
  socket.on('play', function (payload) {
    console.log('play ' + JSON.stringify(payload))
    if (payload.tc) {
      hyperdeck.goTo(payload.tc)
      hyperdeck.play(payload.speed)
    } else {
      hyperdeck.play(payload)
    }
  })
  socket.on('goto', function (payload) {
    console.log('goto ' + payload)
    hyperdeck.goto(payload)
  })
  socket.on('save', function () {
    console.log('save')
    hyperdeck.transportInfo().then(saveLocation)
  })
  socket.on('record', function () {
    console.log('Recording')
    hyperdeck.record()
  })
  socket.on('delete', function (ref) {
    deleteLocation(ref)
  })
  socket.on('increment', function (payload) {
    var i = payload[0]
    var tc = timecode.init({
      framerate: '50',
      timecode: '00:00:00:00'
    })
    tc.add(savedLocations[i].timecode)
    if (payload[1] > 0) {
      tc.add('00:00:01:00')
    } else {
      tc.subtract('00:00:01:00')
    }
    savedLocations[i].timecode = tc.toString()
    console.log(savedLocations)
    io.emit('markers', savedLocations)
    writeMarkers(savedLocations)
  })
  socket.on('getTransportInfo', function (ref) {
    hyperdeck.transportInfo()
      .then((response) => {
        console.log(response)
      })
  })
})
hyperdeck.getNotifier().on('asynchronousEvent', function (response) {
  console.log('Got an asynchronous event with code ' + response.code + '.')
})

app.set('view engine', 'ejs')
app.get('/', function (req, res) {
  var data = {
    'connected': true,
    'markers': savedLocations
  }
  res.render('index.ejs', data)
})

// hyperdeck.getTimecodeInfo();
// hyperdeck.dataEmitter.on('transport', saveLocation);
