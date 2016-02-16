var net = require('net');
var client = new net.Socket();

//Confussing the shit out of me here down.

client.connect({host: '192.168.72.64', port: 9993}, function() {
	console.log('Connected');

	// client.write('play');
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
function play(){
	try{
		client.write('play\n');
		console.log('Playing');
	}catch (err){
		console.log(err);
	}
}

// function play(speed){
// 	var play = "play ";
// 	var playSpeed = play.concat(speed.concat('\n'));
// 	client.write(playSpeed);
// }

//stop
function stop(){
	try{
		client.write('stop\n');
		console.log('Playing');
	}catch (err){
		console.log(err);
	}
}

setTimeout(stop,1000);