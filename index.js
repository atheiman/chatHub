var app = require('./node_modules/express')();
var http = require('http').Server(app);
var io = require('./node_modules/socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
// 	io.emit('connect', 'a user connected');
  io.emit('whoareyou', "");
	
	socket.on('iam', function(username){
	  io.emit('joinedroom', username + " has joined the room.");
	});
	
	socket.on('chat message', function(messageObj){
		console.log('message: ' + messageObj);
		io.emit('chat message', messageObj);
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		io.emit('disconnect', 'a user disconnected');
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});