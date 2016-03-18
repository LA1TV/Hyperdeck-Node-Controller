var events = require('events');
var notifier = new events.EventEmitter();

//Listen for the data coming in, and pass to other functions to deal with.
function parser(payload) {
  //Convert to string then pass into the switch/case to decide which function to use.
  var data = payload.toString();
  console.log(data);
  switch (data.charAt(0)){
    case "1":
      failureResponseCode(data);
      break;
    case "2":
      successResponseCode(data);
      break;
    case "5":
      asynchornousResponseCode(data);
      break;
    default:
      console.error("ERROR");
      notifier.emit('errorInData', data);
  }
}

function failureResponseCode(data) {
  console.log("***** FAILURE - SYNCHRONOUS RESPONSE *****");
  dataObject = convertDataToObject(data);
  notifier.emit('synchronousEventError', dataObject);
}

function successResponseCode(data) {
  console.log("***** SUCESSFUL - SYNCHRONOUS RESPONSE *****");
  dataObject = convertDataToObject(data);
  notifier.emit('synchronousEvent', dataObject);
}

function asynchornousResponseCode(data) {
  console.log("***** ASYNCHRONOUS RESPONSE *****");
  dataObject = convertDataToObject(data);
  notifier.emit('asynchronousEvent', data);
}

/**
 * Converts the data to a Object.
 * So the hyperdeck class can do things nicely with it.
 * @return dataObject, The data in a nice object.
 **/
function convertDataToObject(data) {
  var dataObject = {};
  var re = /^(.*)\: (.*)$/;

  data = data.split("\r\n"); //Splits the data on a new line.
  dataObject.title = data.shift(); // First element of the data object will be {title : FIRST_LINE_OF_DATA}
  //Append the rest into an object for emitting.
  for(var i = 0; i< data.length; i++) {
    var lineData = re.exec(data[i]);
    //First element in array is the whole string.
    if(lineData) {
      dataObject[lineData[1]] = lineData[2];
    }
  }
  return dataObject;
}

function getNotifier() {
  return notifier;
}

module.exports.parser = parser;
module.exports.notifier = getNotifier;
