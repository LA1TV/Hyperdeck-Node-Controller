var net = require('net');
var client = new net.Socket();

//Conects to the Hyperdeck.

client.connect({host: '192.168.72.64', port: 9993}, function() {
	console.log('Connected');
});

function play(speed){
	try{
		if(!speed){
			client.write('play\n');
			console.log('Playing');
		}else{
			client.write("play: speed: ");
			client.write(speed + '\n');
			console.log('Playing at speed: ' + speed);
		}
	}catch (err){
		console.log(err);
	}
}

//stop
function stop(){
	try{
		client.write('stop\n');
		console.log('Stoping');
	}catch (err){
		console.log(err);
	}
}

function record(){
	try{
		client.write('record\n');
		console.log('Recording');
	}catch (err){
		console.log(err);
	}
}

function getTimecode(callback){
	client.write('transport info\n');
	client.on('data', function(data){
		slotID = data.substring(data.indexOf("slot id: ")+9, data.indexOf("slot id: ")+10);
		clipID = data.substring(data.indexOf("clip id: ")+9, data.indexOf("clip id: ")+11);
		timecodeData = data.substring(data.indexOf("timecode: ")+10, data.indexOf("timecode: ")+21);
		var output = {"timecode": timecodeData, "slotID": slotID, "clipID": clipID};
		return callback(output);
	});
}


module.exports.play = play;
module.exports.stop = stop;
module.exports.record = record;
module.exports.getTimecode = getTimecode;
