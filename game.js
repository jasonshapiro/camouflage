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

  start: function() {

    Crafty.init(Game.width(), Game.height());
    Crafty.background('rgb(249, 223, 125)');

    Crafty.scene('gameStart');

  }

}

$text_css = { 'size': '24px', 'family': 'Arial', 'color': 'red', 'text-align': 'center' };
