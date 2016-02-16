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

//play at a predefined speed
function playAtSpeed(speed){
	try{
		var play = "play ";
		speed = speed.toString();
		var playSpeed = play.concat(speed);
		client.write(playSpeed + '\n');
		console.log('Playing at speed: ' + speed);
	}catch (err){
		console.log(err);
	}
}

//stop
function stop(){
	try{
		client.write('stop\n');
		console.log('Playing');
	}catch (err){
		console.log(err);
	}
}

setTimeout(playAtSpeed(40),1000);



