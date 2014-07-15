var app = require('/tmp/node_modules/express')();
var http = require('/tmp/node_modules/http').Server(app);
var io = require('/tmp/node_modules/socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('/tmp/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('chat message', 'a user connected');
	
	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		io.emit('chat message', 'a user disconnected');
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
