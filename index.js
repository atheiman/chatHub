var app = require('./node_modules/express')();
var http = require('http').Server(app);
var io = require('./node_modules/socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

var rooms = {};
var users = {};
var num = 1;

io.on('connection', function(socket){
	console.log('a user connected');
	
	//Generate Unique id for the user.
	var userId = 'user#' + num++;
	
	//Set the default room.
	var room = "defaultLobby";
	
	//Check if the default room already exits
	//in rooms object.
	if(!rooms.hasOwnProperty(room))
		rooms[room] = {};
		
	socket.join(room);
		
	socket.emit('request username', "");
	
	socket.on('receive username', function(username){
	
		socket.username = username;
		
		var usernames = rooms[room];
		
		if(usernames == null)
			usernames = {};
			
		usernames[userId] = socket.username;
		rooms[room] = usernames;
		console.log(rooms);
		console.log(socket.username + " logged in with the ID: " + userId);
		
		io.to(room).emit('join room', { id:userId, username:socket.username, usernames:rooms[room] });
	});

	socket.on('username changed', function(username){
		console.log(socket.username + " is changing names. ID: " + userId);
		socket.username = username;
		console.log(rooms);
		
		var usernames = rooms[room];
		usernames[userId] = username;
		
		io.to(room).emit('changed name', { id:userId, username:socket.username });
	});
	
	socket.on('chat message', function(messageObj){
		console.log('message: ' + messageObj);
		
		if(typeof room == "undefined")
			io.emit('chat message', messageObj);
		else
			io.to(room).emit('chat message', messageObj);
	});
	
	socket.on('request join room', function(newRoom){
	
		socket.join(newRoom);
		socket.leave(room);
		room = newRoom;
		
		//Check if the default room already exits
		//in rooms object.
		if(!rooms.hasOwnProperty(room))
			rooms[room] = {}

		var usernames = rooms[room];
		
		if(usernames == null)
			usernames = {};
			
		usernames[userId] = socket.username;
		rooms[room] = usernames;
		
		io.to(room).emit('join room', { id:userId, username:socket.username, usernames:rooms[room] });
		
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		
		var usernames = rooms[room];
		delete usernames[userId];
		
		io.to(room).emit('disconnected', userId);
	});
	
	socket.on('left room', function(){
	
		var usernames = rooms[room];
		delete usernames[userId];
	
		io.to(room).emit('disconnected', userId);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});