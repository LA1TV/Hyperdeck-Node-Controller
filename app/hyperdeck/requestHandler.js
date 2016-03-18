var parser = require('./parser.js');
var Promise = require('promise');


var pendingRequests = [];
var requestCompletionPromise = [];
var requestInProgress = false;

/**
 * The Request handler for the Hyperdeck API.
 * This chains the requests so only one is sent at a time.
 * @param client, The client connection to the hyperdeck.
 **/
function RequestHandler(client) {

  /**
   * Checks the chain isn't empty or that the request is in progress.
   * Then takes from the bottom of the chain and do the request.
   * Once the request has finished do more things.
   * Performs the next request based of the chain, runs until the chain is empty.
   **/
  function performNextRequest() {
    if (pendingRequests.length === 0 || requestInProgress) {
      return; //returns if theres nothing left in the chain or theres a request in progress.
    }

    requestInProgress = true;
    var request = pendingRequests.shift();

    client.write(request);

    // Listen for a response, either error, or data.
    function handleResponse(response) {
      requestCompletionPromise.shift().resolve(response);
    }

    function handleResponseClientError(response) {
      requestCompletionPromise.shift().reject(response);
    }

    function handleError(response) {
      requestCompletionPromise.shift().reject(response);
    }
    parser.getNotifier().one("synchronousEvent", function syncEventListenetr(response){handleResponse(response);});
    parser.getNotifier().one("synchronousEventError", function(response){handleResponseClientError(response);});
    parser.getNotifier().one("error", function errorListener(response){handleError(response);});



    requestInProgress = false;
    performNextRequest();
  }

  // Response Listener.
  try{
    client.on('data', function(data){parser.parser(data);});
  }catch(err){
    console.log("ERROR: " + err);
  }

  /**
   * Called externally with the request made into it.
   * Then chains and calls performNextRequest.
   * @return The promise for the hyperdeck based of its completion.
   **/
  this.makeRequest = function(requestToProcess) {
    var completionPromise = new Promise(function(resolve, reject) {
      requestCompletionPromise.push({
        resolve: resolve,
        reject: reject
      });
    });
    pendingRequests.push(requestToProcess);
    performNextRequest();
    return completionPromise;
  };



  // /**
  //  * Performs the request made by the Hyperdeck
  //  * @param request, the request to send to the hyperdeck.
  //  **/
  // function doReqest(request) {
	//   // makeRequest
  //
  // }
}

module.exports = RequestHandler;
