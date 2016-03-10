var net = require('net');
var client = new net.Socket();
var events = require('events');
var dataEmitter = new events.EventEmitter();

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
			if(typeof(speed)=="object"){
				client.write("play: speed: "+speed.speed+"\n");
				goto(speed.tc)
				console.log("play: speed: "+speed.speed+" from: "+speed.tc+"\n");


			}else{
			client.write("play: speed: ");
			client.write(speed + '\n');
			console.log('Playing at speed: ' + speed);
		}
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
}
function goto(data){
	client.write('goto: timecode: '+data+'\n');
	console.log('goto: timecode: '+data+'\n')
}

client.on('data', function processTC(payload){
	data=payload.toString();
	if(data.includes("transport info")){
	slotID = data.substring(data.indexOf("slot id: ")+9, data.indexOf("slot id: ")+10);
	clipID = data.substring(data.indexOf("clip id: ")+9, data.indexOf("clip id: ")+11);
	timecodeData = data.substring(data.indexOf("timecode: ")+10, data.indexOf("timecode: ")+21);
	var output = {"timecode": timecodeData, "slotID": slotID, "clipID": clipID};
	dataEmitter.emit('transport', output);
}
});

module.exports.play = play;
module.exports.stop = stop;
module.exports.record = record;
module.exports.getTimecode = getTimecode;
module.exports.goto = goto;

module.exports.dataEmitter = dataEmitter;
