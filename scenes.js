Crafty.scene('gameStart', function() {

  var decoys = 20;

  for (var x = 0; x < Game.map_grid.width; x++) {

    for (var y = 0; y < Game.map_grid.height; y++) {

      if (Math.random() < decoys/(Game.map_grid.height*Game.map_grid.height))  {

        Crafty.e('decoy').at(x,y);

      }

    }

  }

  Crafty.e('player1').at(Math.floor(Math.random()*Game.map_grid.width), Math.floor(Math.random()*Game.map_grid.height));
  Crafty.e('player2').at(Math.floor(Math.random()*Game.map_grid.width), Math.floor(Math.random()*Game.map_grid.height));


});

Crafty.scene('startScreen', function() {

  Crafty.e('2D, DOM, Text')
    .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
    .text('Victory!');

});
