
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('a', 'assets/sprites/a.png');
	game.load.image('b', 'assets/sprites/b.png');

}

var codeCaption;
var spriteA;
var joint;
function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.debugDraw.joints = true;
	game.physics.box2d.gravity.y = 500;

    //A revolute joint with upper and lower limits enabled.
	{
		// Static box
		var spriteA = game.add.sprite(game.world.centerX, game.world.centerY, 'a');
		game.physics.box2d.enable(spriteA);
		spriteA.body.static = true;
		
		// Dynamic box
		var spriteB = game.add.sprite(game.world.centerX, game.world.centerY, 'b');
		game.physics.box2d.enable(spriteB);
		
		//bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
		joint = game.physics.box2d.revoluteJoint(spriteA, spriteB, 0, 0, 0, 0, 0, 0, false, -45, 60, true);
        //Note: Upper/Lower limit parameters are in degrees here, but joint.GetUpperLimit(), .GetLowerLimit(), and .SetLimits() all use radians
	}
    
	// Set up handlers for mouse events
	game.input.onDown.add(mouseDragStart, this);
	game.input.addMoveCallback(mouseDragMove, this);
	game.input.onUp.add(mouseDragEnd, this);
	
	game.add.text(5, 5, 'A basic revolute joint, Click to begin. \nUse Up/Down arrows to change upper limit,    Left/Right arrows to change lower limit', { fill: '#ffffff', font: '14pt Arial' });

    codeCaption = game.add.text(5, 60, '', { fill: '#ccffcc', font: '14pt Arial' });
	
	// Start paused so user can see how the joints start out
	game.paused = true;
	game.input.onDown.add(function(){game.paused = false;}, this);
    
    
    cursors = game.input.keyboard.createCursorKeys();

}

var pressed;
function update() {

    //Note: The functions joint.SetLimits(), joint.SetLowerLimit(), and joint.SetUpperLimit() are all in degrees, even though the Revolute Joint constructor uses degrees for the upper and lower limit parameters
    if (cursors.up.isDown)
    {
        if (!pressed) {  //increase upper limit when up is pressed
            joint.SetLimits(joint.GetLowerLimit(), joint.GetUpperLimit() + 0.25);
            pressed = true;
        }
    } else if (cursors.down.isDown)
    {
        if (!pressed) { //decrease upper limit when down is pressed
    	    joint.SetLimits(joint.GetLowerLimit(), joint.GetUpperLimit() - 0.25);
            pressed = true;
        }
    } else if (cursors.left.isDown) {
        if (!pressed) { //decrease lower limit when left is pressed
    	    joint.SetLimits(joint.GetLowerLimit() - 0.25, joint.GetUpperLimit());
            pressed = true;
        }
    } else if (cursors.right.isDown) {
        if (!pressed) { //increase lower limit when right is pressed
    	    joint.SetLimits(joint.GetLowerLimit() + 0.25, joint.GetUpperLimit());
            pressed = true;
        }
    } else {
        pressed = false;
    }
    
    codeCaption.text = 'Lower Limit: ' + joint.GetLowerLimit() + ',  Upper Limit: ' + joint.GetUpperLimit();

}


function mouseDragStart() { game.physics.box2d.mouseDragStart(game.input.mousePointer); }
function mouseDragMove() {  game.physics.box2d.mouseDragMove(game.input.mousePointer); }
function mouseDragEnd() {   game.physics.box2d.mouseDragEnd(); }


function render() {
	
	// update will not be called while paused, but we want to change the caption on mouse-over
	if ( game.paused ) {
		update();
	}
	
	game.debug.box2dWorld();
	
}