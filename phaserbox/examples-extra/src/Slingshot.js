
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

	game.load.image('platform', 'assets/sprites/platform.png');
	game.load.image('block', 'assets/sprites/firstaid.png');
	game.load.image('ball', 'assets/sprites/shinyball.png');
	game.load.image('arrow', 'assets/sprites/arrow.png');

}

var ballSprite;
var arrowSprite;
var mouseDownPosition = {};
var groundLevel;

function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.setBoundsToWorld();
	game.physics.box2d.gravity.y = 1000;

	// Static platform for ground
	var platformSprite = game.add.sprite(400, 600, 'platform');
	platformSprite.scale.set(2);
	game.physics.box2d.enable(platformSprite);
	platformSprite.body.static = true;

	// Dynamic boxes
	groundLevel = 600 - 64; // platform is 128 high, centered at bottom of screen
	for (var x = 0; x < 3; x++) {
		for (var y = 0; y < 6; y++) {
			var blockSprite = game.add.sprite(550 + x * 75, groundLevel - 16 - y * 32, 'block'); // block sprite is 32x32
			game.physics.box2d.enable(blockSprite);
		}
	}
	
	// Increase default density before creating ball
	game.physics.box2d.density = 4;
	
	// Arrow sprite for aiming
	arrowSprite = game.add.sprite(100, groundLevel - 100, 'arrow');
	arrowSprite.anchor.set(0,0.5);
	arrowSprite.alpha = 0;
	
	// The ball
	ballSprite = game.add.sprite(100, groundLevel - 100, 'ball');
	game.physics.box2d.enable(ballSprite);
	ballSprite.body.gravityScale = 0;
	ballSprite.body.setCircle(16);
	
	// Set up handlers for mouse events
	game.input.onDown.add(mouseDragStart, this);
	game.input.addMoveCallback(mouseDragMove, this);
	game.input.onUp.add(mouseDragEnd, this);
	
	game.add.text(5, 5, 'Drag the objects with the mouse.', { fill: '#ffffff', font: '14pt Arial' });
}

function mouseDragStart() {
	
	ballSprite.body.gravityScale = 0;
	ballSprite.body.x = 100;
	ballSprite.body.y = groundLevel - 100;
	ballSprite.body.velocity.x = 0;
	ballSprite.body.velocity.y = 0;
	ballSprite.body.angularVelocity = 0;
	
    mouseDownPosition.x = game.input.mousePointer.position.x;
    mouseDownPosition.y = game.input.mousePointer.position.y;
	arrowSprite.alpha = 0.5;
	mouseDragMove();
    
}

function mouseDragMove() {
	
	if ( mouseDownPosition == null )
		return;
	
	var mouseNowPosition = game.input.mousePointer.position;
	var dx = mouseNowPosition.x - mouseDownPosition.x;
	var dy = mouseNowPosition.y - mouseDownPosition.y;
	var length = Math.sqrt( dx*dx + dy*dy );
	
	arrowSprite.scale.set(length * 0.05, 0.5);
	arrowSprite.rotation = Math.atan2( -dy, -dx );
    
}

function mouseDragEnd() {

	var mouseNowPosition = game.input.mousePointer.position;
	var dx = mouseNowPosition.x - mouseDownPosition.x;
	var dy = mouseNowPosition.y - mouseDownPosition.y;
	
    ballSprite.body.gravityScale = 1;
	ballSprite.body.velocity.x = -dx * 10;
	ballSprite.body.velocity.y = -dy * 10;

	arrowSprite.alpha = 0;
	mouseDownPosition = {};
}
