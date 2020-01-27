
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('platform', 'assets/sprites/platform.png');
	game.load.image('firstaid', 'assets/sprites/firstaid.png');
	game.load.image('phaser', 'assets/sprites/phaser.png');

}

_debugType = 
{
	NONE	: 0,
	SOME	: 1,
	WORLD	: 2,
	INFO	: 3
};

var caption;
var debugType = _debugType.INFO; // will roll over to NONE in create()
var spritesToDebug = [];
var firstaidSprite; // after create(), will be the last created sprite
var whackerSprite;
var stepCount = 0;

function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.gravity.y = 200;

	// Static platform for boxes to fall on
	var platformSprite = game.add.sprite(400, 550, 'platform');
	game.physics.box2d.enable(platformSprite);
	platformSprite.body.static = true;
	
	var spacing = 32; // size of firstaid sprite
	var baseLayerCount = 15;
	var startX = 400 - (baseLayerCount / 2 - 0.5) * spacing;
	var startY = 350;

	// Create pyramid of boxes.	
	while (baseLayerCount > 0) {
		for (var x = 0; x < baseLayerCount; x++) {
			firstaidSprite = game.add.sprite(startX + spacing * x, startY, 'firstaid');
			game.physics.box2d.enable(firstaidSprite);
			if ( Math.random() < 0.25 ) {
				spritesToDebug.push( { sprite: firstaidSprite, color: Phaser.Color.getRandomColor(0,255,255) } );
			}
		}
		baseLayerCount -= 1;
		startX += 0.5 * spacing;
		startY -= spacing;
	}
	
	// Nasty kinematic whacker to disrupt the pile
	whackerSprite = game.add.sprite(400, 550, 'phaser');
	game.physics.box2d.enable(whackerSprite);
	whackerSprite.body.kinematic = true;
	
	caption = game.add.text(5, 5, '', { fill: '#ffffff', font: '14pt Arial' });
	
	game.input.onDown.add(changeDebugType, this);
	changeDebugType();
}

function changeDebugType() {
	debugType += 1;
	if (debugType > _debugType.INFO) {
		debugType = _debugType.NONE;
	}
	caption.text = 'Click to toggle debug display (currently: '+
		(debugType == _debugType.SOME ? 'some' :
		debugType == _debugType.WORLD ? 'world' :
		debugType == _debugType.INFO ? 'info' : 'none') +')';
}

function update() {
	stepCount += 1;
	if (stepCount == 300) { // five seconds
		//whackerSprite.body.velocity.y = -10;
		whackerSprite.body.angularVelocity = -0.5;
	}
}

function render() {
	if ( debugType == _debugType.SOME ) {
		var i = spritesToDebug.length;
        while (i--)
        {
		game.debug.body(spritesToDebug[i].sprite, Phaser.Color.getWebRGB(spritesToDebug[i].color));
        }
	}
	else if ( debugType == _debugType.WORLD ) {
		game.debug.box2dWorld();
	}
	else if ( debugType == _debugType.INFO ) {
		game.debug.bodyInfo(firstaidSprite, firstaidSprite.x + 20, firstaidSprite.y + 20, 'rgb(192,192,192)');
		game.debug.body(firstaidSprite, 'rgb(0,255,0)');
	}
}
