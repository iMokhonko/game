	
var socket = io.connect();

var players = [];
var playerIndex;

var userNickname;


function userLogin() {
	userNickname = $('#nickname').val();
	// отправляем данные на сервер с ником игрока
	socket.emit('userLogin', {nickname : userNickname, x : 0, y: 0});
	$("#loginForm").hide();
	$("#PointJS-canvas_0").show();
	pjs.system.initFullPage();

}

// получаем данные от сервера что у нас новый игрок
socket.on('updatePlayers', function(upd_players) {
	players.splice(0, players.length);
	for(var i = 0; i < upd_players.length; i++) {
		players[i] = { 
			nickname: upd_players[i].nickname,
			x: upd_players[i].x,
			y: upd_players[i].y
		};
	}
	console.log(players);
});


// GAME-------------------------------

	var pjs = new PointJS(200, 200, {
		backgroundColor : "black", 
	});

	//pjs.system.initFullPage();


	var game = pjs.game;

	// mouse Control
	var mouse = pjs.mouseControl.initMouseControl();
	// key Control
	var key = pjs.keyControl.initKeyControl();
	// Point
	var point = pjs.vector.point;

	// Camer
	var camera = pjs.camera;

	// Brush
	var brush = pjs.brush;



	var objects = [];
	var objectsNames = [];

	function createObj(owner) {

		var tmp = game.newRectObject({
			positionC : mouse.getPosition(),
			w: 50,
			h: 50,
			fillColor : "white", 	
		});
		tmp.name = 'object';
		tmp.own = userNickname;

		var tmp_name = brush.drawText({
		  text : tmp.own, 
		  x : tmp.x + tmp.w/2, 
		  y : tmp.y - 30,
		  color : "white",
		  size : 20,
		  align: 'center'
		});

		objectsNames.push(tmp_name);
		objects.push(tmp);
	}

	function drawNames(objects) {
		for(i = 0; i < objects.length; i++) {
			brush.drawText({
			  text : objects[i].own, 
			  x : objects[i].x + objects[i].w/2, 
			  y : objects[i].y - 30,
			  color : "white",
			  size : 20,
			  align: 'center'
			});
		}
	}



	game.newLoop('game', function () {

		var i;

		game.clear();

		var player;

		//pjs.OOP.drawArr(objects);


		// отрисовываем обьекты игроков
		objects.splice(0, objects.length);

		for(i = 0; i < players.length; i++) {

			if(!players[i].x) {
				players[i].x = 0;
			}
			if(!players[i].y) {
				players[i].y = 0;
			}

			var tmp_obj = game.newRectObject({
				positionC : point(players[i].x, players[i].y),
				w: 50,
				h: 50,
				fillColor : "white"	
			});

			if(players[i].nickname == userNickname) {
				playerIndex = i;
			}

			// if(tmp_obj.own == userNickname) {
			// 	tmp_obj.fillColor = "red";
			// }

			tmp_obj.own = players[i].nickname;
			tmp_obj.draw();
			objects.push(tmp_obj);
		}

		if(objects.length > 0) {

			for(i = 0; i < objects.length; i++) {
				if(objects[i].own == userNickname) {
					obj = i;
					objects[i].fillColor = "red";
					break;
				}
			}



			
				if(key.isDown("RIGHT")) {
					var pos = objects[obj].x;
					console.log(players[playerIndex].x);
					players[playerIndex].x = players[playerIndex].x + 4;
				}
				if(key.isDown("LEFT")) {
					var pos = objects[obj].x;
					console.log(players[playerIndex].x);
					players[playerIndex].x = players[playerIndex].x - 4;
				}
				if(key.isDown("UP")) {
					var pos = objects[obj].y;
					console.log(players[playerIndex].y);
					players[playerIndex].y = players[playerIndex].y - 4;
				}
				if(key.isDown("DOWN")) {
					var pos = objects[obj].y;
					console.log(players[playerIndex].y);
					players[playerIndex].y = players[playerIndex].y + 4;
				}

				socket.on("playerMove", function (player) {
					players[player.playerId].x = player.x;
					players[player.playerId].y = player.y;
				});

				socket.emit("playerMove", {
					playerId : playerIndex,
					x : players[playerIndex].x,
					y : players[playerIndex].y
				});
		}


		drawNames(objects);
		

		// if(mouse.isDown("RIGHT")) {
		// 	camera.move(point(1,0));
		// }


	});



	game.setLoop('game');
	game.start();

