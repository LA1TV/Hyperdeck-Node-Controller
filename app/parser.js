var events = require('events');


function failureResponseCode(data){
  console.log("*****\nFAILURE :( \n******")
}

function successResponseCode(data){
console.log("*****\nSUCCESS!\n******")
}

function asynchornousResponseCode(data){
  console.log("*****\nASYNC RESPONSE!\n******")

}

//Listen for the data coming in, and pass to other functions to deal with.
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


  module.exports.parser = parser;
