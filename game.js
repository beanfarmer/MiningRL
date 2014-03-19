var Game = {
	display: null,
	
	init: function() {
		this.display = new ROT.Display({width: 80, height: 25});
		document.body.appendChild(this.display.getContainer());
		
		this._generateCaves();	
	},

	_generateCaves: function() {
		var w = 80;
		var h = 25;
		var map = new ROT.Map.Cellular(w, h);
		
		map.randomize(0.5);

		for (var i=0; i < 4; i++) {
			map.create(this.display.DEBUG);
		}
	}

};

Game.init();
