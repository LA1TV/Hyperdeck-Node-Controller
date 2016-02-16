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
	client.write('transport info\n', function(){
		client.on('data', function(data){
			data = data.toString();
		});
	});

	slotID = data.substring(data.indexOf("slot id: ")+9, data.indexOf("slot id: ")+10);
	console.log("Slot: " + slotID);
}



module.exports.play = play;
module.exports.stop = stop;
module.exports.getTimecode = getTimecode;
