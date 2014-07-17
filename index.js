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
	userId = 'user#' + num++;
	users[userId] = socket;
	socket.emit('request username', usernames);
	
	socket.on('receive username', function(username){
		socket.username = username;
		usernames[userId] = username;
		console.log(socket.username);
		io.emit('joinedroom', { id:userId, username:socket.username });
	});
	
	socket.on('usernamed changed', function(username){
		socket.username = username;
		usernames[userId] = username;
		console.log(socket.username);
		io.emit('changed name', { id:userId, username:socket.username });
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