
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

	game.load.spritesheet('diamonds', 'assets/sprites/diamonds32x24x5.png', 32, 24);

}


function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.debugDraw.joints = true;
	game.physics.box2d.setBoundsToWorld();
	game.physics.box2d.gravity.y = 500;

	
    //Prismatic joint with an angled axis
	
    // Static box
	var spriteA = game.add.sprite(game.world.centerX, game.world.centerY, 'diamonds', 1);
	game.physics.box2d.enable(spriteA);
	spriteA.body.static = true;
		
	// Dynamic box
	var spriteB = game.add.sprite(game.world.centerX, game.world.centerY, 'diamonds', 2);
	game.physics.box2d.enable(spriteB);
	
	// bodyA, bodyB, axisX, axisY, ax, ay, bx, by, motorSpeed, motorForce, motorEnabled, lowerLimit, upperLimit, limitEnabled
	game.physics.box2d.prismaticJoint(spriteA, spriteB, 0.5, 1);



	// Set up handlers for mouse events
	game.input.onDown.add(mouseDragStart, this);
	game.input.addMoveCallback(mouseDragMove, this);
	game.input.onUp.add(mouseDragEnd, this);
	
	game.add.text(5, 5, 'Prismatic joint. Use mouse to drag and move box', { fill: '#ffffff', font: '14pt Arial' });
	game.add.text(5, 25, 'Basic prismatic joint with a custom axis (ax = 0.5, ay = 1)', { fill: '#ffffff', font: '14pt Arial' });

    
}


function mouseDragStart() { game.physics.box2d.mouseDragStart(game.input.mousePointer); }
function mouseDragMove() {  game.physics.box2d.mouseDragMove(game.input.mousePointer); }
function mouseDragEnd() {   game.physics.box2d.mouseDragEnd(); }


function render() {

	
	game.debug.box2dWorld();
	
}