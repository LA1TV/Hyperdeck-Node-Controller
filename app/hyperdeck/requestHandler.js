
var parser = require('./parser.js');
var pendingRequests = [];
var requestCompletionPromise = [];

var requestInProgress = false;

function RequestHandley(parser) {

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

  function performNextRequest() {
    if (pendingRequests.length === 0 || requestInProgress) {
      return;
    }

    requestInProgress = true;
    var request = pendingRequests.shift();
    doReqest(request).then(function(data) {
      requestCompletionPromise.shift().resolve(data);
      requestInProgress = false;

      performNextRequest();
    });
  }

  function doRequest(request) {
    client.write(request);
  }
}

module.exports.makeRequest = makeRequest;
