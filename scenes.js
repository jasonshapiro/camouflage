Crafty.scene('gameStart', function() {
	
  Game.over = false;
  
  Crafty.unbind('EnterFrame');
  Crafty.viewport.x = 0; // Correction for screenshake drift
  
  Crafty.e('blackScreen').fadeOut(.01);
  	
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

Crafty.scene('startScreenScene', function() {


 	Crafty.e('2D, Canvas, Text')
    	.attr({ w: 100, h: 20, x: 180, y: 280, z: 6 })
    	.text('Press Any Key To Start')
    	.textFont({ size: '36px', weight: 'bold'})
    	.textColor('#FFFFFF', 0.6)
    	.bind('KeyDown', function(e) {
    		Crafty.scene('gameStart');
    	});
	
	
});


Crafty.scene('victoryScreenScene', function() {
	
	Crafty.e('2D, DOM, Text')
		.attr({ w: 400, h: 20, x: 180, y: 280, z: 6 })
		.text('The current score is ' + Game.player1Score + "-" + Game.player2Score + ". \n Press any key to play again.")
		.bind('KeyDown', function(e) {
    		Crafty.scene('gameStart');
    	});
});

$text_css = { 'size': '24px', 'family': 'Arial', 'color': 'red', 'text-align': 'center' };
