var events = require('events');
var notifier = new events.EventEmitter();

function parser(payload){
 data = payload.toString();
 console.log("parsing the data! " + data.charAt(0))
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


 };

function failureResponseCode(data){
  console.log("*****\nFAILURE :( \n******");
  notifier.emit('fail');

}

function successResponseCode(data){
console.log("*****\nSUCCESS!\n******");
notifier.emit('success');

}

function asynchornousResponseCode(data){
  console.log("*****\nASYNC RESPONSE!\n******");
  notifier.emit('async data');

}

//Listen for the data coming in, and pass to other functions to deal with.





  module.exports.parser = parser;
  module.exports.notifier = notifier;
