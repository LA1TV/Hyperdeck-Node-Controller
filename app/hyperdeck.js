var net = require('net');

var parser = require('./parser.js');
//Conects to the Hyperdeck.
var Promise = require('promise');



function hyperdeck(ip){
	var client = new net.Socket();
	var connected = false;

client.connect({
	host: ip,
	port: 9993
}, function() {
	console.log('Connected');
	connected = true;
});

client.on('data', function(data){parser.parser(data); console.log('Passed to parser\n***************'); console.log(data.toString());});


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
}

//stop
this.stop = function() {
	try {
		client.write('stop\n');
		console.log('Stoping');
	} catch (err) {
		console.log(err);
	}
}

this.record = function() {
	try {
		client.write('record\n');
		console.log('Recording');
	} catch (err) {
		console.log(err);
	}
}

this.getTimecode = function() {
	client.write('transport info\n');
	return new Promise(function(fulfill, reject){
		parser.notifier.on('transport', function(data){
if (data=='err') reject(data)
			else fulfill(data)

		}
	})
}

this.goto = function(data) {
	client.write('goto: timecode: ' + data + '\n');
	console.log('goto: timecode: ' + data + '\n');
}

/**
 * Gets the transport information from the hyperdeck in an array.
 * Status, speed, slot id, display timecode, timecode.
 * a
 **/
this.getTransportInfo = function(){
	try {
		client.write('transport info/n');

	}catch(err){
		console.log(err);
	}
}

/*client.on('data', function processTC(payload) {
							data = payload.toString();
								if (data.includes("transport info")) {
									slotID = data.substring(data.indexOf("slot id: ") + 9, data.indexOf("slot id: ") + 10);
									clipID = data.substring(data.indexOf("clip id: ") + 9, data.indexOf("clip id: ") + 11);
									timecodeData = data.substring(data.indexOf("timecode: ") + 10, data.indexOf("timecode: ") + 21);
									var output = {
										"timecode": timecodeData,
										"slotID": slotID,
										"clipID": clipID
									};
									dataEmitter.emit('transport', output);
								}
							},

);*/


}



exports.connect = function(options){
	return new hyperdeck(options);
};
