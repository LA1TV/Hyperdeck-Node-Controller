var parser = require('./parser.js');

var pendingRequests = [];
var requestCompletionPromise = [];
var requestInProgress = false;
var hyperdeckClient = "";

/**
 * The Request handler for the Hyperdeck API.
 * This chains the requests so only one is sent at a time.
 * @param client, The client connection to the hyperdeck.
 **/
function RequestHandler(client) {

  // Response Listener.
  client.on('data', function(data){parser.parser(data);});

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
    doReqest(request).then(function(data) {
      if (resolve) {
        requestCompletionPromise.shift().resolve(data);
      } else if (reject) {
        requestCompletionPromise.shift().reject(data);
      }
      requestInProgress = false;
      performNextRequest();
    });
  }

  /**
   * Performs the request made by the Hyperdeck
   * @param request, the request to send to the hyperdeck.
   **/
  function doRequest(request) {
	  // makeRequest
	  client.send(request);
    // Listen for a response, either error, or data.
	  parser.notifier.one("synchronousEvent", function(response){handleResponse(response);});
    parser.notifier.one("synchronousEventError", function(response){handleResponseClientError(response);});
    parser.notifier.one("error", function(response){handleError(error);});

    function handleResponse(response) {
      parser.notifer.off("synchronousEventError", data);
      parser.notifer.off("error", data);
      resolve(response);
    }

    function handleResponseClientError(response) {
      parser.notifer.off("synchronousEvent", data);
      parser.notifer.off("error", data);
      reject(response);
    }

    function handleError(response) {
      parser.notifer.off("synchronousEvent", data);
      parser.notifer.off("synchronousEventError", data);
      reject(response);
    }
  }
}

module.exports = exports;
