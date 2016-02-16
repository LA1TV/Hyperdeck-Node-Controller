var net = require('net');
var client = new net.Socket();

//Confussing the shit out of me here down.

client.connect(9993, '192.164.72.64', function() {
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

