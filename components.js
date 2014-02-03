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


Crafty.c('solid', {

  init: function() {
    this.requires('2D, Canvas, Grid, Color, Collision')
    .color('rgb(0, 0, 0)')
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



Crafty.c('player1', {

  init: function() {

    this.requires('solid, Multiway');
    this.multiway(3, {D:0, W: -90, A: 180, S: 90});
    this._keyToDirection = {68: [1,0], 87: [0,-1], 65: [-1,0], 83: [0,1]}
    this._lastKey = 68;
    this.bind('KeyDown', function(e) {
      if (e.key === 68 || e.key === 87 || e.key === 65 || e.key === 83) {
        this._lastKey = e.key; // keeps track of the last key pressed for bullet direction
      };

      if (e.key === 32) {this.shootBullet(this)};

    });
  },

  shootBullet: function(player) {
    Crafty.e('Bullet').at(player.x/Game.map_grid.tile.width + player._keyToDirection[player._lastKey][0], player.y/Game.map_grid.tile.height + player._keyToDirection[player._lastKey][1]).move(player._keyToDirection[player._lastKey]);
  }

});


Crafty.c('player2', {

  init: function() {
    this.requires('solid, Multiway');
    this.multiway(3, {RIGHT_ARROW: 0, UP_ARROW: -90, LEFT_ARROW: 180, DOWN_ARROW: 90})
    this._keyToDirection = {39: [1,0], 38: [0,-1], 37: [-1,0], 40: [0,1]}
    this._lastKey = 39;
    this.bind('KeyDown', function(e) {
      if (e.key === 39 || e.key === 40 || e.key === 37 || e.key === 38) {
        this._lastKey = e.key; // keeps track of the last key pressed for bullet direction
      };

      if (e.key === 13) {this.shootBullet(this)};

    });
  },

  shootBullet: function(player) {
    Crafty.e('Bullet').at(player.x/Game.map_grid.tile.width + player._keyToDirection[player._lastKey][0], player.y/Game.map_grid.tile.height + player._keyToDirection[player._lastKey][1]).move(player._keyToDirection[player._lastKey]);
  }

});



Crafty.c('Bullet', {
  init: function() {
    this.requires('solid, Movement');
    this.setFrameSpeed(3);
    this.onHit('decoy', function() {this.destroy()});
    this.onHit('player1', function() {Crafty('player1').color('rgb(255,0,0)'); Game.player2Score++;}); //player 2 victory condition
    this.onHit('player2', function() {Crafty('player2').color('rgb(255,0,0)'); Game.player1Score++;}); //player 1 victory condition

    this.bind('EnterFrame', function() {

      if (!this._moving) {this.move(this._lastMoved)} // keeps bullet moving

    })
  }
})
