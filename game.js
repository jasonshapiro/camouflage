Game = {

  map_grid: {
    width: 25,
    height: 20,
    tile: {
      width: 32,
      height: 32
    }
  },

  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  player1Score: 0,
  player2Score: 0,
  over: true,

  start: function() {

    Crafty.init(Game.width(), Game.height());
    Crafty.background('#0C0C0C');

    Crafty.scene('startScreenScene');

  }

}


function screenShake(frameArray) {
	if (!frameArray) {frameArray = [7,7,-7,-7,-7,-7,7,7,7,7,-7,-7,-7,-7,7,7]};
	var framecount = 0;
	Crafty.bind('EnterFrame', function() {
		Crafty.viewport.x += frameArray[framecount];
		framecount++;
		if (framecount == frameArray.length) {Crafty.unbind('EnterFrame')}
	});
};
