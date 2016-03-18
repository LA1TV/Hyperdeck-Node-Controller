var net = require('net');
var Promise = require('promise');
var RequestHandler = require('./request-handler.js');
var timecode = "";



function Hyperdeck(ip){
	var client = new net.Socket();
	var connected = false;
	var request = new RequestHandler(client);

	client.connect({
		host: ip,
		port: 9993
	}, function() {
		console.log('Connected');
		connected = true;
	});

	this.play = function(speed) {
		try {
			if (!speed) {
				client.write('play\n');
				console.log('Playing');
			} else {
				if (typeof(speed) == "object") {
					//Goto timecode before playing
					goto(speed.tc);
					client.write("play: speed: " + speed.speed + "\n");

					console.log("play: speed: " + speed.speed + " from: " + speed.tc + "\n");
				} else {
					client.write("play: speed: ");
					client.write(speed + '\n');
					console.log('Playing at speed: ' + speed);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};

	//stop
	this.stop = function() {
		try {
			client.write('stop\n');
			console.log('Stoping');
		} catch (err) {
			console.log(err);
		}
	};

	this.record = function() {
		try {
			client.write('record\n');
			console.log('Recording');
		} catch (err) {
			console.log(err);
		}
	};

	/**
	 * Gets the transport information from the hyperdeck in an array.
	 * Status, speed, slot id, display timecode, timecode.
	 * a
	 **/
	this.getTransportInfo = function() {
		request.makeRequest('transport info\n').then(function(data){
		if(resolve){
			timecode = data.timecode;
			console.log("Speed is: " + data.speed);
		}else if (reject) {
			console.log("Error in response: " + data);
		}
	});

		// return new Promise(function(fulfill, reject){
		// 	parser.notifier.one('transport', function(data){
		// 		console.log("***************************\n Speed at this point is: " + data.speed);
		// 		if (data!='err') {
		// 			timecode = data.timecode;
		// 			console.log("Speed is: " + data.speed);
		// 			fulfill(data);
		// 		} else {
		// 			reject(data);
		// 		}
		// 	});
		// });

	};

	/**
	 * goto function
	 **/
	this.goto = function(data) {
		client.write('goto: timecode: ' + data + '\n');
		console.log('goto: timecode: ' + data + '\n');
	};

}
module.exports = Hyperdeck;
