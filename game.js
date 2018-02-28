	
var socket = io.connect();

var players = [];

var player = {};


function Player(opts) {
	this.nick = opts.nick;
	this.x = opts.x;
	this.y = opts.y;
}

function userLogin() {
	var nick = $("#nickname").val();

	player = new Player({ nick : nick, x : 100, y : 100 });

	socket.emit('userLogin', player);
	$("#game").show();
	$('#loginForm').hide();


}

function drawPlayers() {
	$("#game").empty();
	for (var i = 0; i < players.length; i++) {
		if(players[i].nick == player.nick) {
			$('#game').append("<div style=\"top: "+player.y+"px;left: "+player.x+"px\" id=\"own\" class=\"box\">"+players[i].nick+"</div>");
		} else {
			$('#game').append("<div style=\"top: "+players[i].y+"px;left: "+players[i].x+"px\" class=\"box\">"+players[i].nick+"</div>");
		}
	}
}

function ownMove(e) {

	var speed = 5;

	switch(e.keyCode) {

		// right
		case 39: {
			var playerBox = document.getElementById('own');
			var currentPos = parseInt(playerBox.style.left);
			playerBox.style.left = (currentPos + speed) + "px";
			player.x = currentPos + speed;
			break;
		}

		//left
		case 37: {
			var playerBox = document.getElementById('own');
			var currentPos = parseInt(playerBox.style.left);
			playerBox.style.left = (currentPos - speed) + "px";
			player.x = currentPos - speed;
			break;
		}

		// up
		case 38: {
			var playerBox = document.getElementById('own');
			var currentPos = parseInt(playerBox.style.top);
			playerBox.style.top = (currentPos - speed) + "px";
			player.y = currentPos - speed;
			break;
		}

		// down
		case 40: {
			var playerBox = document.getElementById('own');
			var currentPos = parseInt(playerBox.style.top);
			playerBox.style.top = (currentPos + speed) + "px";
			player.y = currentPos + speed;
			break;
		}

	}

	socket.emit('playerMove', player);


}

document.addEventListener('keydown', ownMove);

// получаем данные от сервера что у нас новый игрок
socket.on('updatePlayers', function(upd_players) {
	
	players.splice(0, players.length);
	
	for(var i = 0; i < upd_players.length; i++) {
			players[i] = { 
				nick: upd_players[i].nick,
				x: upd_players[i].x,
				y: upd_players[i].y
			};
	}

	
	drawPlayers();
	console.log(players);
});

socket.on('playerMove', function(res_player) {
		
	//console.log(player);

	for(var i = 0; i < players.length; i++) {
		if(players[i].nick == res_player.nick && players[i].nick != player.nick) {
			players[i].x = res_player.x;
			players[i].y = res_player.y;
			console.log('other player move');
			break;
		}
	}
	drawPlayers();
	//console.log(players);
});