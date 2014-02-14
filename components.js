Crafty.c('Grid', {

  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid

  at: function(x, y) {

    if (x === undefined && y === undefined) {
      return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
    }

    else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }

  }

});


Crafty.c('blackScreen', {
	init: function() {
		this.requires('2D, Canvas, Color, fadeOut');
		this.color('rgb(0,0,0)');
		this.h = Game.height();
		this.w = Game.width();
		this.z = 5;
	}
})


Crafty.c('fadeOut', {
	init: function() {
		this._fadeSpeed = .1;
	},
	
	fadeOut: function(speed) {
		if (speed) {this._fadeSpeed = speed};
		this.bind('EnterFrame', function() {
			if (this.alpha > this._fadeSpeed) {this.alpha -= this._fadeSpeed} else {this.destroy()};
		})
	}
	
})

Crafty.c('fadeIn', {
	init: function() {
		this._fadeSpeed = .1;
	},
	
	fadeIn: function(speed) {
		if (speed) {this._fadeSpeed = speed};
		this.bind('EnterFrame', function() {
			if (this.alpha < 1) {this.alpha += this._fadeSpeed} else {this.alpha = 1};
		})
	}
	
})

Crafty.c('solid', {

  init: function() {
    this.requires('2D, Canvas, Grid, Color, Collision')
    .color('rgb(255, 255, 255)')
  }

});


Crafty.c('decoy', {

  init: function() {
    this.requires('solid, AI');
  }

});

Crafty.c('AI',{

  _directions:  [[0,-1], [0,1], [1,0], [-1,0]],
  init: function() {
    this._moveChance = 0.1;
    this.requires('Movement');
    this.bind("EnterFrame", function(e) {
      if (!this._moving) {
        if (Math.random() < this._moveChance) {
          this.move(this._randomDirection())
        }
      }
    });
  },

  moveChance: function(val) {
    this._moveChance = val;

  },

  _randomDirection: function() {
    return this._directions[Math.floor(Math.random()*4)];
  }

});


Crafty.c('Movement', {

  init: function() {
      this._stepFrames = 15;
      this._tileSize = 32;
      this._moving = false;
      this._vx = 0; this._destX = 0; this._sourceX = 0;
      this._vy = 0; this._destY = 0; this._sourceY = 0;
      this._frames = 0;

      this.bind("EnterFrame", function(e) {
        if(!this._moving) return false;

        // If we're moving, update our position by our per-frame velocity
        this.x += this._vx;
        this.y += this._vy;
        this._frames--;

        if(this._frames == 0) {
          // If we've run out of frames,
          // move us to our destination to avoid rounding errors.
          this._moving = false;
          this.x = this._destX;
          this.y = this._destY;
        }
      }); // end of EnterFrame bind
  }, // end of init:

   move: function(direction) {
        // Don't continue to move if we're already moving
        if(this._moving) return false;
        this._moving = true;

        // Let's keep our pre-movement location
        // Hey, Maybe we'll need it later :)
        this._sourceX = this.x;
        this._sourceY = this.y;

        // Figure out our destination
        this._destX = this.x + direction[0] * this._tileSize;
        this._destY = this.y + direction[1] * this._tileSize;

        // Get our x and y velocity
        this._vx = direction[0] * this._tileSize / this._stepFrames;
        this._vy = direction[1] * this._tileSize / this._stepFrames;

        this._frames = this._stepFrames;
        this._lastMoved = direction;  // Memory of the last moved direction
    },

    setFrameSpeed: function(frames) {
       this._stepFrames = frames;
    },

    // A function we'll use later to
    // cancel our movement and send us back to where we started
    cancelMovement: function() {
      this.x = this._sourceX;
      this.y = this._sourceY;
      this._moving = false;
    }
  });


Crafty.c('player', {
	init: function() {
		this.requires('solid, Multiway');
		this.bind('EnterFrame', function(){
			if (this.x < 0) {this.x += 3};
			if (this.x > Game.width() - Game.map_grid.tile.width) {this.x -= 3};
			if (this.y < 0) {this.y += 3};
			if (this.y > Game.height() - Game.map_grid.tile.height) {this.y -= 3};
		})
	},
	
	shootBullet: function(player) {
  		if (player._keysDown.length < 1) {var direction = player._keyToDirection[player._lastKey]}
  		else {
			var direction = [0,0];
			var keyArray = player._keysDown;
			for (var i = 0, item; item = keyArray[i++];) {
		
				direction[0] += player._keyToDirection[item][0];
				direction[1] += player._keyToDirection[item][1];

			};
		};

   	 	Crafty.e('Bullet').setCreator(player).at(player.x/Game.map_grid.tile.width + direction[0], player.y/Game.map_grid.tile.height + direction[1]).move(direction);
		// important to prevent bullets from killing creators, and adds the secret ability to leave mines :)
   	 	
  	}
});


Crafty.c('player1', {

  init: function() {

    this.requires('player');
    this.multiway(3, {D:0, W: -90, A: 180, S: 90});
    this._keyToDirection = {68: [1,0], 87: [0,-1], 65: [-1,0], 83: [0,1]}
    this._lastKey = 68;
    this._keysDown = [];
    this.bind('KeyDown', function(e) {
      if (e.key === 68 || e.key === 87 || e.key === 65 || e.key === 83) {
        this._lastKey = e.key; // keeps track of the last key pressed for bullet direction
        this._keysDown.push(e.key);
      };

      if (e.key === 32) {this.shootBullet(this)};

    });
    this.bind('KeyUp', function(e) {
    	if (e.key === 68 || e.key === 87 || e.key === 65 || e.key === 83) {
    		var index = this._keysDown.indexOf(e.key);	
    		if (index > -1) {this._keysDown.splice(index, 1)};
		};
    });
  }

});


Crafty.c('player2', {

  init: function() {
    this.requires('player');
    this.multiway(3, {RIGHT_ARROW: 0, UP_ARROW: -90, LEFT_ARROW: 180, DOWN_ARROW: 90})
    this._keyToDirection = {39: [1,0], 38: [0,-1], 37: [-1,0], 40: [0,1]}
    this._lastKey = 39;
    this._keysDown = [];
    this.bind('KeyDown', function(e) {
      if (e.key === 39 || e.key === 40 || e.key === 37 || e.key === 38) {
        this._lastKey = e.key; // keeps track of the last key pressed for bullet direction
        this._keysDown.push(e.key);
      };

      if (e.key === 13) {this.shootBullet(this)};
      
    });
    this.bind('KeyUp', function(e) {
    	if (e.key === 39 || e.key === 40 || e.key === 37 || e.key === 38) {
    		var index = this._keysDown.indexOf(e.key);	
    		if (index > -1) {this._keysDown.splice(index, 1)};
		};
    });
  }
});


Crafty.c('Bullet', {
  init: function() {
    this.requires('solid, Movement');
    this.origin("center");
    this.setFrameSpeed(3);
    this._creator = Crafty('player');
    
    this.onHit('decoy', function() {this.destroy(); Crafty.e('bulletFade').origin('center').attr({x: this.x, y: this.y, rotation: this.rotation})}); //delays the destruction of the bullet by one frame for smoother animation

    this.onHit('player1', function() {
		if (!this._creator.has('player1')) {    	
    		this.destroy(); Crafty.e('bulletFade').origin('center').attr({x: this.x, y: this.y, rotation: this.rotation}).color('rgb(255,0,0)'); screenShake();
    		if (!Game.over) {this.gameEnd('player2', 'player1'); Game.over = true}}; //player 2 victory condition
		});

    this.onHit('player2', function() {
    	if (!this._creator.has('player2')) {    	
    		this.destroy(); Crafty.e('bulletFade').origin('center').attr({x: this.x, y: this.y, rotation: this.rotation}).color('rgb(255,0,0)'); screenShake();
    		if (!Game.over) {this.gameEnd('player1', 'player2'); Game.over = true}}; ; //player 1 victory condition
		});


	var bulletMovement = function() {

      if (!this._moving) {this.move(this._lastMoved)}; // keeps bullet moving
      if (this._moving) {this.rotation += 30};

   };

    this.bind('EnterFrame', bulletMovement);
  },
  
  gameEnd: function(winningplayer, losingplayer) {
  		Crafty(losingplayer).color('rgb(255,0,0)').unbind('KeyDown').multiway(0);
  		if (winningplayer === 'player1') {var wintext = 'Player 1'; Game.player1Score++;} else {var wintext = 'Player 2'; Game.player2Score++;}; // Add to score
  		Crafty.e('2D, DOM, Text')
		.attr({ w: 400, h: 80, x: 300, y: 280, z: 1000 })
		.textFont({ size: '36px', weight: 'bold'})
    	.textColor('#CDCDCD', 1)
		.text(wintext + " wins!");
		 setTimeout(function() {Crafty.scene('gameStart')}, 5000);
  },
  
  setCreator: function(player) {
  		this._creator = player;
  		return this;
  }

});

Crafty.c('bulletFade', {
	init: function() {
		this.requires('solid, Tween, Color').tween({alpha: 0}, 300).one("TweenEnd", function() {this.destroy()});
	}
});


