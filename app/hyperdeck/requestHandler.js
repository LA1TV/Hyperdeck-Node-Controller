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
      return; //returns if there's nothing left in the chain or there's a request in progress.
    }

    var request = pendingRequests.shift();
    var requestCompletionPromise = requestCompletionPromise.shift();
    requestInProgress = true;

    function onRequestCompleted() {
      requestInProgress = false;
      performNextRequest();
    }
    
    function registerListeners() {
      parser.getNotifier().on("synchronousResponse", handleResponse);
      parser.getNotifier().on("connectionLost", handleConnectionLoss);
    }
    
    function removeListeners() {
      parser.getNotifier().off("synchronousResponse", handleResponse);
      parser.getNotifier().off("connectionLost", handleConnectionLoss);
    }
    
    function handleResponse(response) {
      console.log("Got response. Resolving provided promise with response.");
      removeListeners();
      requestCompletionPromise.resolve(response);
      onRequestCompleted();
    }

    function handleConnectionLoss() {
      console.log("Connection lost. Rejecting provided promise to signify failure.");
      removeListeners();
      requestCompletionPromise.reject();
      onRequestCompleted();
    }
    
    registerListeners();
    // make the request
    // either the "synchronousResponse" or "connectionLost" event should be
    // fired at some point in the future.
    console.log("Making request: "+request);
    client.write(request);
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
    console.log("Queueing request: "+requestToProcess);
    performNextRequest();
    return completionPromise;
  };
}

module.exports = RequestHandler;
