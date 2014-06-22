var Game = {
	display: null,
	map: {},
	player: null,
	engine: null,
	wallCells: [],
	floorCells: [],
	gemCells: [],
	caveInCells: [],
	score: null,

	init: function() {
		this.display = new ROT.Display({width: 80, height: 40, fontSize: 14});
		document.body.appendChild(this.display.getContainer());
		score = 0;
		this._generateCaves();

		var scheduler = new ROT.Scheduler.Simple();
		scheduler.add(this.player, true);
		this.engine = new ROT.Engine(scheduler);
		this.engine.start();
	},

	_generateCaves: function() {
		var w = 80;
		var h = 40;
		var map = new ROT.Map.Cellular(w, h, {
			born: [5, 6, 7, 8],
			survive: [2, 3, 4, 5]});

		map.randomize(0.8);

		var cellCallback = function(x, y, value) {
			var key;

			if (value) {	/* eg, if this point is a wall. */
				key = x+","+y;
				this.wallCells.push(key);
				this.map[key] = "#";
				return; /* Don't need to carry on and accidentally write the wrong character */
			}
			key = x+","+y;
			this.floorCells.push(key);
			this.map[key] = ".";
		}

		for (var i=49; i >= 0; i--) {
			map.create(i ? null : cellCallback.bind(this));
		}

		this._generateMinePoints(this.wallCells);

		this._drawWholeMap();
		this._createPlayer(this.floorCells);
	},

	_createPlayer: function(floorCells) {
		var index = Math.floor(ROT.RNG.getUniform() * floorCells.length);
		var key = floorCells.splice(index, 1)[0];
		var parts = key.split(",");
		var x = parseInt(parts[0]);
		var y = parseInt(parts[1]);
		this.player = new Player(x, y);
	},

	_drawWholeMap: function() {
		for (var key in this.map) {
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			this.display.draw(x, y, this.map[key]);
		}

	},

	_generateMinePoints: function(wallCells) {
		for(var i = 0; i <10; i++) {
			var index = Math.floor(ROT.RNG.getUniform() * wallCells.length);
			var key = wallCells.splice(index, 1)[0];
			var mine = wallCells.pop(key);
			this.floorCells.push(mine);
			this.map[key] = "^";
			if (i == 2 || i == 4) { this.gemCells.push(key); }
			if (i == 5 || i == 7) { this.caveInCells.push(key); }
		}
	},


};

var Player = function(x, y) {
	this._x = x;
	this._y = y;
	this._draw();
}

Player.prototype.act = function() {
	Game.engine.lock();
	window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {
	var keyMap = {};
	keyMap[38] = 0;
	keyMap[33] = 1;
	keyMap[39] = 2;
	keyMap[34] = 3;
	keyMap[40] = 4;
	keyMap[35] = 5;
	keyMap[37] = 6;
	keyMap[36] = 7;

	var code = e.keyCode;

	if (code == 13 || code == 32) {
		this._mineCell();
		return;
	}

	if (!(code in keyMap)) { return; } // It's not one of the numpad directions, ignore it.

	// Is the direction valid? (aka not walking into a wall)
	var dir = ROT.DIRS[8][keyMap[code]];
	var newX = this._x + dir[0];
	var newY = this._y + dir[1];
	var newKey = newX + "," + newY;
	if (Game.wallCells.indexOf(newKey) != -1) { return; }
	if (!(newKey in Game.map)) { return; }

	Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
	this._x = newX;
	this._y = newY;
	this._draw();
	window.removeEventListener("keydown", this);
	Game.engine.unlock();
}

Player.prototype._mineCell = function() {
	var key = this._x + "," + this._y;
	if (Game.gemCells.indexOf(key) != -1) {
		Game.score += 10;
		Game.gemCells.pop(key);
		alert("You found a gemstone! Score: " + Game.score);
		if (Game.gemCells.length <= 0) {
			alert("You have found all the gemstones! Well done!");
			Game.engine.lock();
			window.removeEventListener("keydown", this);
		}
	} else if (Game.caveInCells.indexOf(key) != -1) {
			alert("You triggered a cave in! You tried to run away, but unfortunately you got crushed under the falling rocks. Your score is: " + Game.score);
			Game.engine.lock();
			window.removeEventListener("keydown", this);
	} else {
		var rand = Math.floor((Math.random() * 3) + 1);
		switch(rand){
		case 1:
				alert("You find nothing but dirt and stone.");
				break;

		case 2:
				alert("You find nothing but dirt.");
				break;

		case 3:
				alert("You find nothing but stone.");
				break;
		}


	}
}

Player.prototype._draw = function() {
	Game.display.draw(this._x, this._y, "@", "#ff0");
}

Game.init();
