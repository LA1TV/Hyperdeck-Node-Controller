
function failureResponseCode(data){
  client.emit
}

function successResponseCode(data){

}

function asynchornousResponseCode(data){

}

//Listen for the data coming in, and pass to other functions to deal with.
client.on('data', function parser(payload){
  data = payload.toString();
  switch (data.chatAt(0)){
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
  });
