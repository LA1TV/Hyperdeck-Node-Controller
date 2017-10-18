var events = require('events')
// Create an eventEmitter object
var eventEmitter = new events.EventEmitter()

eventEmitter.on('test', function () { console.log('event triggered by test') })
function setup () {
  setTimeout(function () { eventEmitter.emit('test', 'hello') }, 1000)
}
/*
function getTime(){
  setup()
  var data = eventEmitter.on('test', function(data){console.log('event triggered by test ' + data)})
 .then return data
} */

/*
function getTime(callback){
  setup()
eventEmitter.once('test', callback(data))
} */
function parseText (data, doSomething) {
  return 'l27 the listener recieved data ' + data
}

function getTime (doSomething) {
  setup()
  eventEmitter.on('test', function (data) { return doSomething(parseText(data)) })
}

getTime(function (data) { console.log(data) })
