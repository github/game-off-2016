(function () {
  // define variables
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var player, score, stop;
  var enemies = [];
  /**
   * Get a random number between range
   * @param {integer}
   * @param {integer}
   */
  function rand(low, high) {
    return Math.floor( Math.random() * (high - low + 1) + low );
  }
 
  
  /**
   * Asset pre-loader object. Loads all images
   */
  var assetLoader = (function() {
    // images dictionary
    this.imgs        = {
      'forest'        : 'media/Forest.jpg',
      'rider' 		  : 'media/Rider.png',
	  'log'	 	  	  : 'media/Log.png',
	  'bush'		  : 'media/Bush.png'
    };

    var assetsLoaded = 0;                                // how many assets have been loaded
    var numImgs      = Object.keys(this.imgs).length;    // total number of image assets
    this.totalAssest = numImgs;                          // total number of assets

    /**
     * Ensure all assets are loaded before using them
     * @param {number} dic  - Dictionary name ('imgs', 'sounds', 'fonts')
     * @param {number} name - Asset name in the dictionary
     */
    function assetLoaded(dic, name) {
      // don't count assets that have already loaded
      if (this[dic][name].status !== 'loading') {
        return;
      }

      this[dic][name].status = 'loaded';
      assetsLoaded++;

      // finished callback
      if (assetsLoaded === this.totalAssest && typeof this.finished === 'function') {
        this.finished();
      }
    }

    /**
     * Create assets, set callback for asset loading, set asset source
     */
    this.downloadAll = function() {
      var _this = this;
      var src;

      // load images
      for (var img in this.imgs) {
        if (this.imgs.hasOwnProperty(img)) {
          src = this.imgs[img];

          // create a closure for event binding
          (function(_this, img) {
            _this.imgs[img] = new Image();
            _this.imgs[img].status = 'loading';
            _this.imgs[img].name = img;
            _this.imgs[img].onload = function() { assetLoaded.call(_this, 'imgs', img) };
            _this.imgs[img].src = src;
          })(_this, img);
        }
      }
    }

    return {
      imgs: this.imgs,
      totalAssest: this.totalAssest,
      downloadAll: this.downloadAll
    };
  })();

  assetLoader.finished = function() {
	  //if (confirm("Ready to start?"))
			//startGame();
		// else {
			// history.pushState(null, "foo", 'file:///D:/Hacking%20horse/index.html');
			// location.href = "http://lurkmore.so/images/thumb/4/4d/Intlich.jpg/300px-Intlich.jpg";  
		// }
		 mainMenu();
  }

function mainMenu() {
  $('#main').show(300);
 }

 $('.play').click(function() {
  $('#menu').hide(1000, startGame());
 });
 $('.credits').click(function() {
  $('#credits').show(500, function() {$('#menu').hide();});
 });
 $('.back').click(function() {
  $('#credits').hide(500);
  $('#menu').show();

 });
 
  
  /**
   * Creates a Spritesheet
   * @param {string} - Path to the image.
   * @param {number} - Width (in px) of each frame.
   * @param {number} - Height (in px) of each frame.
   */
  function SpriteSheet(path, frameWidth, frameHeight) {
    this.image = new Image();
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    // calculate the number of frames in a row after the image loads
    var self = this;
    this.image.onload = function() {
      self.framesPerRow = Math.floor(self.image.width / self.frameWidth);
    };

    this.image.src = path;
  }

  /**
   * Creates an animation from a spritesheet.
   * @param {SpriteSheet} - The spritesheet used to create the animation.
   * @param {number}      - Number of frames to wait for before transitioning the animation.
   * @param {array}       - Range or sequence of frame numbers for the animation.
   * @param {boolean}     - Repeat the animation once completed.
   */
  function Animation(spritesheet, frameSpeed, startFrame, endFrame) {

    var animationSequence = [];  // array holding the order of the animation
    var currentFrame = 0;        // the current frame to draw
    var counter = 0;             // keep track of frame rate

    // start and end range for frames
    for (var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++)
      animationSequence.push(frameNumber);

    /**
     * Update the animation
     */
    this.update = function() {

      // update to the next frame if it is time
      if (counter == (frameSpeed - 1))
        currentFrame = (currentFrame + 1) % animationSequence.length;

      // update the counter
      counter = (counter + 1) % frameSpeed;
    };

    /**
     * Draw the current frame
     * @param {integer} x - X position to draw
     * @param {integer} y - Y position to draw
     */
    this.draw = function(x, y) {
      // get the row and col of the frame
      var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
      var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);

      ctx.drawImage(
        spritesheet.image,
        col * spritesheet.frameWidth, row * spritesheet.frameHeight,
        spritesheet.frameWidth, spritesheet.frameHeight,
        x, y,
        spritesheet.frameWidth, spritesheet.frameHeight);
    };
  }

  /**
   * Create a parallax background
   */
  var background = (function() {
    var forest   = {};

    /**
     * Draw the backgrounds to the screen at different speeds
     */
    this.draw = function() {
       // Pan background
      forest.x -= this.speed;

      // draw images side by side to loop
      ctx.drawImage(assetLoader.imgs.forest, forest.x, forest.y);
      ctx.drawImage(assetLoader.imgs.forest, forest.x + canvas.width, forest.y);

       // If the image scrolled off the screen, reset
      if (forest.x + assetLoader.imgs.forest.width <= 0)
        forest.x = 0;
    };

    /**
     * Reset background to zero
     */
    this.reset = function()  {
      forest.x = 0;
      forest.y = 0;
      this.speed = 5;
   }

    return {
      draw: this.draw,
      reset: this.reset
    };
  })();

    /**
   * A vector for 2d space.
   * @param {integer} x - Center x coordinate.
   * @param {integer} y - Center y coordinate.
   * @param {integer} dx - Change in x.
   * @param {integer} dy - Change in y.
   */
  function Vector(x, y, dx, dy) {
    // position
    this.x = x || 0;
    this.y = y || 0;
    // direction
    this.dx = dx || 0;
    this.dy = dy || 0;
  }

  /**
   * Advance the vectors position by dx,dy
   */
  Vector.prototype.advance = function() {
    this.x += this.dx;
    this.y += this.dy;
  };

  /**
   * Get the minimum distance between two vectors
   * @param {Vector}
   * @return minDist
   */
  Vector.prototype.checkDist = function(vec) {
	  var flag = true;
	  if (vec.x <= this.x+this.width/2 && vec.x >= this.x - vec.width/3)
	  {
		  if(vec.y - this.y <= this.height*2/3)
		  {
			  flag = false;
		  }
	  }
	  return flag;
    };
  
   var player = (function(player) {
    // add properties directly to the player imported object
    player.width     = 312;
    player.height    = 238;
    player.speed     = 10;

    // jumping
    player.gravity   = 0.9;
    player.dy        = 0;
    player.jumpDy    = -11;
    player.isJumping = false;

    // spritesheets
    player.sheet     = new SpriteSheet('media/Rider.png', player.width, player.height);
    player.walkAnim  = new Animation(player.sheet, 7, 0, 4);
    player.jumpAnim  = new Animation(player.sheet, 7, 5, 5);
    player.anim      = player.walkAnim;

    Vector.call(player, 0, 0, 0, player.dy);

    var jumpCounter = 0;  // how long the jump button can be pressed down

    /**
     * Update the player's position and animation
     */
    player.update = function() {
	  //console.log(player.isJumping);
	  if (player.y >= 310 && player.isJumping){
		  player.isJumping = false;
		  player.dy = 0;
		  player.y = 310;
	  }
	
      // jump if not currently jumping or falling
      if (KEY_STATUS.space && player.dy === 0 && !player.isJumping) {
        player.isJumping = true;
        player.dy = player.jumpDy;
        jumpCounter = 12;
      }

      // jump higher if the space bar is continually pressed
      if (KEY_STATUS.space && jumpCounter) {
        player.dy = player.jumpDy;
      }

      jumpCounter = Math.max(jumpCounter-1, 0);

      this.advance();

      // add gravity
      if (player.isFalling || player.isJumping) {
        player.dy += player.gravity;
      }

      // change animation if falling
      if (player.dy === 0 && !player.isJumping) {
        player.anim = player.walkAnim;
      }
      // change animation is jumping
      else {
        player.anim = player.jumpAnim;
      }

      player.anim.update();
    };

    /**
     * Draw the player at it's current position
     */
    player.draw = function() {
      player.anim.draw(player.x, player.y);
    };

    /**
     * Reset the player's position
     */
    player.reset = function() {
      player.x = 64;
      player.y = 310;
	  player.speed = 10;
    };

    return player;
  })(Object.create(Vector.prototype));
  
    function Sprite(x, y, width, height, type) {
    this.x      = x;
    this.y      = y;
    this.width  = width;
    this.height = height;
    this.type   = type;
    Vector.call(this, x, y, 0, 0);

    /**
     * Update the Sprite's position by the player's speed
     */
    this.update = function() {
      this.dx = -player.speed;
      this.advance();
    };

    /**
     * Draw the sprite at it's current position
     */
    this.draw = function() {
      ctx.save();
      ctx.translate(0.5,0.5);
      ctx.drawImage(assetLoader.imgs[this.type], this.x, this.y);
      ctx.restore();
    };
  }
  Sprite.prototype = Object.create(Vector.prototype);
  
  
  /**
   * Update the players position and draw
   */
  function updatePlayer() {
    player.update();
    player.draw();

    // game over
    if (player.y + player.height >= canvas.height) {
      gameOver();
    }
  }

   function updateEnemies() {
    // animate enemies
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].update();
      enemies[i].draw();

      // // player ran into enemy
      if (player.checkDist(enemies[i]) === false) {
       gameOver();
      }
	}

    // remove enemies that have gone off screen
    if (enemies[0] && enemies[0].x < -enemies[0].width) {
      enemies.splice(0, 1);
    }
  }
  
  /**
   * Spawn new enemy sprites off screen
   */
  function spawnEnemySprites() {
    if (score > 100 && Math.random() > 0.9 && enemies.length < 3) {
	  if(enemies.length >= 1)
	  {  
		if(enemies[enemies.length - 1].x + enemies[enemies.length - 1].width + player.width < canvas.width+100)
			(score>1500 && Math.random() > 0.5) ? enemies.push(new Sprite(canvas.width + 50, 442, 146, 110, 'bush'))
				:enemies.push(new Sprite(canvas.width + 50, 460, 200, 92, 'log'));
	  }
	  else {
        (score>1500 && Math.random() > 0.5) ? enemies.push(new Sprite(canvas.width + 50, 442, 146, 110, 'bush'))
				:enemies.push(new Sprite(canvas.width + 50, 460, 200, 92, 'log'));
	  }
    }
  }
  
  
  /**
   * Game loop
   */
  function animate() {
	if(!stop) {
		  
		requestAnimFrame( animate );
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		background.draw();
		
		if (score % Math.floor(32 / player.speed) === 0) {
        spawnEnemySprites();
      }
		if(score % 100 === 0)
		{
			player.speed += 0.2;
			background.speed += 0.1;
		}
		updateEnemies();
		updatePlayer();
		ctx.fillText('Score: ' + score + 'm', canvas.width - 140, 30);
		score++;
	}
  }

  /**
   * Request Animation Polyfill
   */
  var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback, element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

    /**
   * Keep track of the spacebar events
   */
  var KEY_CODES = {
    32: 'space'
  };
  var KEY_STATUS = {};
  for (var code in KEY_CODES) {
    if (KEY_CODES.hasOwnProperty(code)) {
       KEY_STATUS[KEY_CODES[code]] = false;
    }
  }
  document.onkeydown = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
      e.preventDefault();
      KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
  };
  document.onkeyup = function(e) {
    var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
    if (KEY_CODES[keyCode]) {
      e.preventDefault();
      KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
  };

  
  /**
   * Start the game - reset all variables and entities, spawn platforms and water.
   */
  function startGame() {
	document.getElementById('game-over').style.display = 'none';
	player.reset();
	stop = false;
    score = 0;
    ctx.font = '16px arial, sans-serif';
	ctx.fillStyle="#FFFFFF";
    enemies = [];
    background.reset();

    animate();
  }

   /**
   * End the game and restart
   */
function gameOver() {
  stop = true;	
  $('#score').html(score);
  $('#game-over').show(200);
}

/**
 * Click handlers for the different menu screens
 */
// …
$('.yes').click(function() {
  $('#game-over').hide();
  startGame();
});

$('.no').click(function() {
  $('#game-over').hide(500);
  $('#strange').show(500);
  setTimeout(function() {
    $('#strange').hide(500, startGame());
  }, 2500); 

});
   
  assetLoader.downloadAll();
})();