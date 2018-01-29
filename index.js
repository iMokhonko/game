var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// index.html
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Point JS
app.get('/pointjs_0.2.0.3.js', function(req, res){
  res.sendFile(__dirname + req.url);
});

// Game
app.get('/game.js', function(req, res){
  res.sendFile(__dirname + req.url);
});

// styles
app.get('/styles.css', function(req, res){
  res.sendFile(__dirname + req.url);
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});


// Implementation

var connections = [];
var players = [];

// новое подключение, клиент зашел
io.on('connection', function(socket) {
  

	function updatePlayers() {
		var upd_players = [];
		for(var i = 0; i < players.length; i++) {
			upd_players[i] = { 
				nickname : players[i].nickname,
				x : players[i].x,
				y : players[i].y
			};
		}
		io.emit('updatePlayers', upd_players);
	}

  console.log('new connection ' + socket.id);
  connections.push(socket.id);

  // получаем данные от клиента о новом пользователе
  socket.on('userLogin', function(user) {
  	
  	players.push({
  		socketId : socket.id,
  		nickname : user.nickname,
  		x : 0,
  		y : 0
  	});

  	// отправляем данные о игроках
  	updatePlayers();


  });


  socket.on('playerMove', function(player) {
  	players[player.playerId].x = player.x;
	players[player.playerId].y = player.y;
  	io.emit('playerMove', player);
  });

  // клиент полностью закрыл вкладку
  socket.on('disconnect', function(){
  	var connectionIndex = connections.indexOf(socket.id);
  	connections.splice(connectionIndex, 1);

  	var playerIndex;

  	for(var i = 0; i < players.length; i++) {
  		if(players[i].socketId == socket.id) {
  			players.splice(i, 1);
  			break;
  		}
  	}

  	// отправляем данные о игроках
  	updatePlayers();

    console.log('disconnection  ' + socket.id);
  });

});

