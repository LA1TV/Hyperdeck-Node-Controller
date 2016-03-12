var events = require('events');
var notifier = new events.EventEmitter();

//Listen for the data coming in, and pass to other functions to deal with.
function parser(payload){
  //Convert to string then pass into the switch/case to decide which function to use.
 data = payload.toString();
 console.log(data);
 switch (parseInt(data.charAt(0))){
   case 1:
     failureResponseCode(data);
     break;
   case 2:
     successResponseCode(data);
     break;
   case 5:
     asynchornousResponseCode(data);
     break;
   }
 }

function failureResponseCode(data){
  console.log("*****\nFAILURE!\n******");
  notifier.emit('failure', data.substring(4,data.length));
}

function successResponseCode(data){
  var dataObject = {};
  switch (data.substring(0,2)) {
    case 208: //Transport info.
      dataObject = convertDataToObject(data);
      notifier.emit('transport', dataObject);
      break;
  }
  notifier.emit('success');
}

function asynchornousResponseCode(data){
  console.log("*****\nASYNC RESPONSE!\n******");
  notifier.emit('async data');
}

function convertDataToObject(data) {
  var dataObject = {};
  data = data.split("\n"); //Splits the string into an array on the \n.
  data = data.shift(); //Removes the first element in the array.
  //Append the rest into an object for emitting.
  for(i = 0; i< data.length; i++) {
    dataToGoToObject = data[i].data.split(": ");
    dataObject.dataToGoToObject[0] = dataToGoToObject[1];
  }
  return dataObject;
}





  module.exports.parser = parser;
  module.exports.notifier = notifier;
