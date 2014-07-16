var app = require('./node_modules/express')();
var http = require('http').Server(app);
var io = require('./node_modules/socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('connect', 'a user connected');
	
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		io.emit('disconnect', 'a user disconnected');
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});