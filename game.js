var Game = {
	display: null,
	map: {},	


	init: function() {
		this.display = new ROT.Display({width: 80, height: 40, fontSize: 14});
		document.body.appendChild(this.display.getContainer());
		
		this._generateCaves();	
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
				this.map[key] = "#";
				return; /* Don't need to carry on and accidentally write the wrong character */
			}
			key = x+","+y;
			this.map[key] = ".";
		}

		for (var i=49; i >=0; i--) {
			map.create(i ? null : cellCallback.bind(this));
		}
		
		this._drawWholeMap();
	},

	_drawWholeMap: function() {
		for (var key in this.map) {
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			this.display.draw(x, y, this.map[key]);
		}

	}
	

};

Game.init();
