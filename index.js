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

	// в массив подключений добавляемидентификатор сокета
	connections.push(socket.id);

	// функция для игрока которые зашел и игрока который вышел
	// он отправляет полный массив игроков которые онлайн
	// на клиенте все синхронизируется
	function updatePlayers() {

		io.emit('updatePlayers', players);
		console.log(players);

	}


  // получаем от клиента данные о новом игроке
  socket.on('userLogin', function(player) {
  	
  	players.push({
  		socketId : socket.id,
  		nick : player.nick,
  		x : player.x,
  		y : player.y
  	});

  	//console.log('new connection ' + socket.id);

  	// отправляем данные о игроках
  	updatePlayers();

  });

  socket.on('playerMove', function(player) {
  	
  	console.log(players);

  	for (var i = 0; i < players.length; i++) {
  		if(player.nick == players[i].nick) {
  			players[i].x = player.x;
  			players[i].y = player.y;
  			break;
  		}
  	}

  	io.emit('playerMove', player);

  	// отправляем данные о игроках
  	updatePlayers();

  });



  // клиент полностью закрыл вкладку
  socket.on('disconnect', function(){
  	
  	var connectionIndex = connections.indexOf(socket.id);
  	connections.splice(connectionIndex, 1);

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

