var events = require('events');
var notifier = new events.EventEmitter();

//Listen for the data coming in, and pass to other functions to deal with.
function parser(payload){
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
      console.error("ERROR FUCKING");
  }
}

function failureResponseCode(data){
  console.log("*****\nFAILURE!\n******");
  notifier.emit('failure', data.substring(4,data.length));
}

function successResponseCode(data){
  var dataObject = {};
  console.log("I get here");
  switch (data.substring(0,3)) {
    case "208": //Transport info.
      dataObject = convertDataToObject(data);
      notifier.emit('transport', dataObject);
      break;
  }
  notifier.emit('success');
}

function asynchornousResponseCode(data){
  console.log("*****\nASYNC RESPONSE!\n******");
  notifier.emit('asyncronsousResponse', data);
}

function convertDataToObject(data) {
  var dataObject = {};
  var re = /^(.*)\: (.*)$/;

  data = data.split("\r\n").shift(); //Removes the first element in the array after spliting.

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

function getEmitter() {
  return notifier;
}




  module.exports.parser = parser;
  module.exports.notifier = notifier;
