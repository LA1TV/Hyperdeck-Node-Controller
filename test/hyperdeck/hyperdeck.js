var proxyquire =  require('proxyquire');
var events = require('events');

var responseHandlerNotifier = new events.EventEmitter();
var ASYNCHRONOUS_EVENT_DATA = {
  code: 512,
  text: "Async event",
  params: {
      "protocol version": "9.5",
      model: "xyz",
      time: "12:40:12"
  }
};

// require Hyperdeck but overriding the require("net") and require("ResponseHandler") to use our stubs
var Hyperdeck = proxyquire('../../src/hyperdeck/hyperdeck', {
  'net': getNetStub(),
  './response-handler.js': getResponseHandlerStub()
});


describe('Hyperdeck', function() {
  
  var hyperdeck = null;

  // create a new response handler (and fake socket) before each test
  beforeEach(function() {
    hyperdeck = new Hyperdeck("127.0.0.1");
  });

  afterEach(function() {
    // TODO call destroy() on hyperdeck
  });

  it('can be constructed', function() {
      hyperdeck.should.be.ok;
  });

  it('triggers asynchronousEvent when the responseHandler gets an async response message.', function(done) {
      hyperdeck.getNotifier().once("asynchronousEvent", function(data) {
        data.should.eql(ASYNCHRONOUS_EVENT_DATA);
        done();
      });

      // when the response handler triggers this, the Hyperdeck should retrieve it and forward
      // it on with it's emitter.
      responseHandlerNotifier.emit("asynchronousResponse", ASYNCHRONOUS_EVENT_DATA);
  });
});

function getNetStub() {
  function SocketMock() {}
  SocketMock.prototype.connect = function(opts, onSuccess) {
    setTimeout(function() {
      onSuccess();
    }, 0);
  };

  var netStub = {
    Socket: SocketMock
  };
  return netStub;
}

function getResponseHandlerStub() {

  function ResponseHandler() {}
  // we can now use this event emitter to emit events from the mocked ResponseHandler
  ResponseHandler.prototype.getNotifier = function() {
    return responseHandlerNotifier;
  };
  return ResponseHandler;
}