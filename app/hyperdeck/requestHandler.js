var parser = require('./parser.js');

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
   * Called externally with the request made into it.
   * Then chains and calls performNextRequest.
   * @return The promise for the hyperdeck based of its completion.
   **/
  function makeRequest(requestToProcess) {
    var completionPromise = new Promise(function(resolve, reject) {
      requestCompletionPromise.push({
        resolve: resolve,
        reject: reject
      });
    });
    pendingRequests.push(requestToProcess);
    performNextRequest();
    return completionPromise;
  }

  /**
   * Checks the chain isn't empty or that the request is in progress.
   * Then takes from the bottom of the chain and do the request.
   * Once the request has finished do more things.
   * Performs the next request based of the chain, runs until the chain is empty.
   **/
  function performNextRequest() {
    if (pendingRequests.length === 0 || requestInProgress) {
      return; //returns if theres nothing left in the chain.
    }

    requestInProgress = true;
    var request = pendingRequests.shift();
    doReqest(request).then(function(data) {
      requestCompletionPromise.shift().resolve(data);
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
	parser.getEmitter().one("synchronousEvent", handleResponse);

	
	emitter.one("connectionLost", handleError);
	// connection lost
	parser.getEmitter().off("synchronouseEvent", handleResponse);
	reject();


	function handleResponse(data) {
		emitter.off("connectionLost", handleError);
		resolve(data);
	}

	function handleError() {
		parser.getEmitter().off("synchronouseEvent", handleResponse);
		reject();
	}
}
}

module.exports.makeRequest = makeRequest;
