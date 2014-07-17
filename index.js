var app = require('./node_modules/express')();
var http = require('http').Server(app);
var io = require('./node_modules/socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

var usernames = {};
var users = {};
var num = 1;

io.on('connection', function(socket){
	console.log('a user connected');
	var userId = 'user#' + num++;
	users[userId] = socket;
	socket.emit('request username', usernames);
	
	socket.on('receive username', function(username){
		socket.username = username;
		usernames[userId] = username;
		console.log(socket.username + " logged in with the ID: " + userId);
		io.emit('joinedroom', { id:userId, username:socket.username });
	});

	socket.on('username changed', function(username){
		console.log(socket.username + " is changing names. ID: " + userId);
		socket.username = username;
		usernames[userId] = username;
		io.emit('changed name', { id:userId, username:socket.username });
	});
	
	socket.on('chat message', function(messageObj){
		console.log('message: ' + messageObj);
		io.emit('chat message', messageObj);
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		delete users[userId];
		delete usernames[userId];
		io.emit('disconnected', userId);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});