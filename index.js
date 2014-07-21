// var app = require('./node_modules/express')();
var express = require('express');
var app = express();
// var http = require('http').Server(app);
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// var port = process.env.PORT || 80;

app.get('/', function(req, res){
  res.sendfile('index.html');
});

// app.use('/assets', connect.static(__dirname + '/assets'));

app.use(express.static(__dirname + '/assets'));
var rooms = {};
var roomBuckets = {};
var users = {};
var num = 1;

io.on('connection', function(socket){
	console.log('a user connected');
	
	//Generate Unique id for the user.
	var userId = 'user#' + num++;
	
	//Set the default room.
	var room = "DefaultLobby";
	
	//Check if the default room already exits
	//in rooms object.
	if(!rooms.hasOwnProperty(room)){
		rooms[room] = {};
		roomBuckets[room] = [];
	}
		
	socket.join(room);
		
	socket.emit('request username', "");
	
	//Get the username from the newly connected client.
	socket.on('receive username', function(username){
	
		socket.username = username;
		
		var usernames = rooms[room];
		
		if(usernames == null)
			usernames = {};
				
		usernames[userId] = { username:socket.username, isAway:false };
		console.log(usernames);
		rooms[room] = usernames;
		console.log(rooms);
		console.log(socket.username + " logged in with the ID: " + userId);
		
		socket.emit('join room', { id:userId, username:socket.username, usernames:rooms[room] });
		socket.broadcast.to(room).emit('user joined', { id:userId, username:socket.username, isAway:usernames[userId].isAway });
	});

	//Update with new username, and tell other clients the users new username.
	socket.on('username changed', function(username){
		console.log(socket.username + " is changing names. ID: " + userId);
		socket.username = username;
		console.log(rooms);
		
		var usernames = rooms[room];
		usernames[userId] = { username:socket.username, isAway:false };
		
		io.to(room).emit('changed name', { id:userId, username:socket.username });
	});
	
	//Send chat message to everyone in the room.
	socket.on('chat message', function(messageObj){
		console.log('message: ' + messageObj);
		
		if(typeof room == "undefined")
			io.emit('chat message', messageObj);
		else
			io.to(room).emit('chat message', messageObj);
	});
	
	//Put client in a new room giving the client the other users in the room and the room's bucket.
	//Tell other users that a new user has entered the room.
	socket.on('request join room', function(newRoom){
	
		//Tell socket to leave the old room and join the new room.
		socket.join(newRoom);
		socket.leave(room);
		
		room = newRoom;
		
		//Check if the default room already exits
		//in rooms object.
		if(!rooms.hasOwnProperty(room)){
			rooms[room] = {};
			roomBuckets[room] = [];
		}

		//Grab the users in the room and check if anyone is in there.
		//If no one is in there, create a new list.
		var usernames = rooms[room];
		if(usernames == null)
			usernames = {};
			
		//Add the current user to the list and the list to the room.
		usernames[userId] = { username:socket.username, isAway:false };
		rooms[room] = usernames;
		
		//Emit to the joined user his unique id, username, and all the users currently in the room.
		socket.emit('join room', { id:userId, username:socket.username, usernames:rooms[room] });
		
		//Emit to everyone else in the room who joined the room.
		socket.broadcast.to(room).emit('user joined', { id:userId, username:socket.username, isAway:usernames[userId].isAway });
		
		console.log("Rooms: " + roomBuckets);
		console.log("Buckets in room: " + roomBuckets[room].length);
		
		//If there are any buckets in the room, sent them to the user who joined the room.
		if(roomBuckets[room].length > 0){
			console.log("Sending buckets");
			socket.emit('send bucketArray', roomBuckets[room]);
		}
			
	});
	
	//Clean bucket item to look for a youtube or imgur link.
	socket.on('send bucket', function(link){
		console.log("Bucket link received: " + link);
		console.log(roomBuckets[room]);
		
		if(link.indexOf("youtube.com/watch") > -1){
			console.log("Youtube video received.");
			SendYoutubeVideo(link);
		}
		else if(link.indexOf("imgur.com") > -1){
			console.log("Imgur recieved.");
			SendImgur(link);
		}
		
	});
	
	//Send imgur bucket item to users in the room.
	function SendImgur(link){
		var imgurParts = link.split("/");
		
		if(imgurParts < 1){
			console.log("Problem parsing Imgur link.");
			return;
		}
		
		console.log(imgurParts);
		
		var embeddedLink = "http://i.imgur.com/" + imgurParts[imgurParts.length-1] + ".gif";
		
		var bucketItem = { id:userId, type:"imgur", src:embeddedLink }
		
		roomBuckets[room].push(bucketItem);
		
		io.to(room).emit('new bucketItem', bucketItem );
		
	
	}
	
	//Send youtube video bucket link to users in the room.
	function SendYoutubeVideo(link){
		var youtubeParts = link.split("?v=");
		
		if(youtubeParts < 1){
			console.log("Problem parsing Youtube link.");
			return;
		}
	
		var embeddedLink = "//www.youtube.com/embed/" + youtubeParts[1]
		
		var bucketItem = { id:userId, type:"youtube", src:embeddedLink }
		
		roomBuckets[room].push(bucketItem);
		
		io.to(room).emit('new bucketItem', bucketItem );
	}
	
	//Tell all users in the room that a user has gone away.
	socket.on('is away', function(){
		usernames = rooms[room];
		usernames[userId].isAway = true;
		io.to(room).emit('user away', userId );
	});
	
	//Tell all users in the room that a user has returned.
	socket.on('is back', function(){
		usernames = rooms[room];
		usernames[userId].isAway = false;
		io.to(room).emit('user returned', userId );
	});
	
	//Tell all users in the room that a user has disconnected.
	socket.on('disconnect', function(){
		console.log('user disconnected');
		
		var usernames = rooms[room];
		delete usernames[userId];
		
		socket.broadcast.to(room).emit('disconnected', userId);
	});
	
	//Tell all users in the room that a user has left the room.
	socket.on('left room', function(){
	
		var usernames = rooms[room];
		delete usernames[userId];
	
		socket.broadcast.to(room).emit('disconnected', userId);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});