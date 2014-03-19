var Game = {
	display: null,
	
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

		for (var i=49; i >=0; i--) {
			map.create(i ? null : this.display.DEBUG);
		}
	}

};

Game.init();
