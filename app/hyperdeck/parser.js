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
  for(var i = 0; i< data.length; i += 1) {
    var lineData = re.exec(data[i]);
    //First element in array is the whole string.
    if(lineData) {
      dataObject[lineData[1]] = lineData[2];
    }
  }
  return dataObject;
}

/**
 * Parses responses from the hyperdeck into a nice object.
 */
 function failureResponseCode(data) {
   console.log("***** FAILURE - SYNCHRONOUS RESPONSE *****");
   return {
     type: "synchronousFailure",
     data: convertDataToObject(data)
   };
 }

 function successResponseCode(data) {
   console.log("***** SUCESSFUL - SYNCHRONOUS RESPONSE *****");
   return {
     type: "synchronousSuccess",
     data: convertDataToObject(data)
   };
 }

 function asynchornousResponseCode(data) {
   console.log("***** ASYNCHRONOUS RESPONSE *****");
   return {
     type: "asynchronous",
     data: convertDataToObject(data)
   };
 }

var Parser = {

  parse: function(payload) {
    //Convert to string then pass into the switch/case to decide which function to use.
    var data = payload.toString();
    console.log(data);
    switch (data.charAt(0)){
      case "1":
        return failureResponseCode(data);
      case "2":
        return successResponseCode(data);
      case "5":
        return asynchornousResponseCode(data);
      default:
        throw "Invalid payload.";
    }
  }
};

module.exports = Parser;
