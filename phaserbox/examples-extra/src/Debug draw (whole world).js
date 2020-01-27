
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

	game.load.image('platform', 'assets/sprites/platform.png');
	game.load.image('block', 'assets/sprites/block.png');

}

function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.gravity.y = 500;
	
	// Choose which debug displays to render (shapes is true by default)
	game.physics.box2d.debugDraw.shapes = true;
	game.physics.box2d.debugDraw.joints = true;
	game.physics.box2d.debugDraw.aabbs = true;
	game.physics.box2d.debugDraw.pairs = true;
	game.physics.box2d.debugDraw.centerOfMass = true;

	// Static platform 
	var platformSprite = game.add.sprite(400, 550, 'platform');
	game.physics.box2d.enable(platformSprite);
	platformSprite.body.static = true;

	// Dynamic box
	var blockSprite = game.add.sprite(400, 300, 'block');
	game.physics.box2d.enable(blockSprite);
	blockSprite.body.angle = 30;
	
	game.add.text(5, 5, 'Debug draw for whole world can include joints, aabbs, center of mass etc.', { fill: '#ffffff', font: '14pt Arial' });
	game.add.text(5, 25, 'Colors are determined by Box2D (to show sleeping status of dynamic bodies).', { fill: '#ffffff', font: '14pt Arial' });

    game.input.onDown.add(mouseDragStart, this);
    game.input.addMoveCallback(mouseDragMove, this);
    game.input.onUp.add(mouseDragEnd, this);

}

function render() {
	
	game.debug.box2dWorld();
	
}

function mouseDragStart() {
    
    game.physics.box2d.mouseDragStart(game.input.mousePointer);
    
}

function mouseDragMove() {
    
    game.physics.box2d.mouseDragMove(game.input.mousePointer);
    
}

function mouseDragEnd() {
    
    game.physics.box2d.mouseDragEnd();
    
}
