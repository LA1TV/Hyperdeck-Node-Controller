var net = require('net');
var client = new net.Socket();

//Confussing the shit out of me here down.

client.connect({port: 9993}, '192.164.72.64', function() {
	console.log('Connected');
	client.write('play');
});




client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});




//Get time code
// function getTimecode(){
// 	client.write('');
// }
//Set timecode

//play at standard speed
function play(){
	client.write('play');
}

function play(speed){
	var play = "play ";
	var playSpeed = play.concat(speed);
	client.write(playSpeed);
}

//stop
function stop(){
	client.write('stop');
}
//record