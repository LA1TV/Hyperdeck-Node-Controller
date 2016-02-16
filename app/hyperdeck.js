var net = require('net');
var client = new net.Socket();

//Conects to the Hyperdeck.

client.connect({host: '192.168.72.64', port: 9993}, function() {
	console.log('Connected');
});

// client.on('data', function(data) {
// 	console.log('Received: ' + data);
// 	client.destroy(); // kill client after server's response
// });

// client.on('close', function() {
// 	console.log('Connection closed');
// });


//Get time code
// function getTimecode(){
// 	client.write('');
// }
//Set timecode

//play at standard speed


//play at a predefined speed or standard speed
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

function getTimecode(){
	
	data = client.write('transport info\n', function(){
		client.on('data', data = function(data){ return data = data.toString();});
		return data;
	});

	if(data.includes("transport info"))
	{
		slotID = data.substring(data.indexOf("slot id: ")+9, data.indexOf("slot id: ")+10);
		console.log("Slot: " + slotID);

		clipID = data.substring(data.indexOf("clip id: ")+9, data.indexOf("clip id: ")+11);
		console.log("Clip: " + clipID);

		timecodeData = data.substring(data.indexOf("timecode: ")+10, data.indexOf("timecode: ")+21);
		console.log("Timecode: " + timecodeData);

		return({"timecode": timecodeData, "slotID": slotID, "clipID": clipID})
	}
}



module.exports.play = play;
module.exports.stop = stop;
module.exports.getTimecode = getTimecode;
