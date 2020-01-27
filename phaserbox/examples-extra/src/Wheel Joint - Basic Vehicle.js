
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('a', 'assets/sprites/a.png');
	game.load.image('b', 'assets/sprites/b.png');
    game.load.image('ball', 'assets/sprites/shinyball.png');
    game.load.image('platform', 'assets/sprites/platform.png');

}

var leftWall;
var rightWall;

var leftJoint;
var rightJoint;
var speed;
function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.debugDraw.joints = true;
	game.physics.box2d.setBoundsToWorld();
	game.physics.box2d.gravity.y = 500;
    game.physics.box2d.friction = 1;

    //static rectangle body to make a wall
    leftWall = new Phaser.Physics.Box2D.Body(game, null, 0, 350, 0.5);
    leftWall.setRectangle(32, 500, 0, 0, 0);
    leftWall.static = true;
    
    //another static rectangle wall for the other side
    rightWall = new Phaser.Physics.Box2D.Body(game, null, 800, 350, 0.5);
    rightWall.setRectangle(32, 500, 0, 0, 0);
    rightWall.static = true;
    
    // body with 2 balls attached via wheel joints. Wheel joint motors are enabled causing the contraption to move
	{
		// box for the vehicles 'chasis'
		var spriteA = game.add.sprite(game.world.centerX, game.world.centerY, 'a');
		game.physics.box2d.enable(spriteA);
		
		// Circle body for the right wheel
		var rightWeel = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
        rightWeel.scale.set(2);
		game.physics.box2d.enable(rightWeel);
		rightWeel.body.setCircle(rightWeel.width/2);
        
        //when it hits the right wall, call hitRightWall, which will reverse the motor speed
        rightWeel.body.setBodyContactCallback(rightWall, hitRightWall, this);
        
        //the wheeljoint connecting the wheel to the chasis. the joint is on an angle, has damping for suspension, and has it's motor enabled.
		// bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled
		rightJoint = game.physics.box2d.wheelJoint(spriteA, rightWeel,  100,100,  0,0,  1,1,  3, 0.1, 350, 100, true );
        
        
        //Circle Body for the left wheel
        var leftWheel = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
        leftWheel.scale.set(2);
		game.physics.box2d.enable(leftWheel);
        leftWheel.body.setCircle(leftWheel.width/2);
        
        //set the callback when it hits the left wall. the callback function will reverse the motor speed
        leftWheel.body.setBodyContactCallback(leftWall, hitLeftWall, this);
        
        //the wheel joint connecting the left wheel to the chasis. same as the right wheel joint except angled to the left
        leftJoint = game.physics.box2d.wheelJoint(spriteA, leftWheel,  -100,100,  0,0,  -1,1,  3, 0.1, 350, 100, true );
	}
    
    //use GetMotorSpeed to set the speed variable, because the speed is in different units than the motorspeed in the joint constructor, so you can't just reuse that value.
    speed = leftJoint.GetMotorSpeed();

	// Set up handlers for mouse events
	game.input.onDown.add(mouseDragStart, this);
	game.input.addMoveCallback(mouseDragMove, this);
	game.input.onUp.add(mouseDragEnd, this);
	
	game.add.text(5, 5, 'Basic Wheel-joint powered vehicle. Click to start.', { fill: '#ffffff', font: '14pt Arial' });
	
	// Start paused so user can see how the joints start out
	game.paused = true;
	game.input.onDown.add(function(){game.paused = false;}, this);
}

function mouseDragStart() { game.physics.box2d.mouseDragStart(game.input.mousePointer); }
function mouseDragMove() {  game.physics.box2d.mouseDragMove(game.input.mousePointer); }
function mouseDragEnd() {   game.physics.box2d.mouseDragEnd(); }

//set motors to turn right after hitting the left wall
function hitLeftWall() {
    leftJoint.SetMotorSpeed(-speed);
    rightJoint.SetMotorSpeed(-speed);
}

//set motors to turn left after hitting the right wall
function hitRightWall() {
    leftJoint.SetMotorSpeed(speed);
    rightJoint.SetMotorSpeed(speed);
}


function update() {
	
	
}

function render() {
	
	// update will not be called while paused, but we want to change the caption on mouse-over
	if ( game.paused ) {
		update();
	}
	
	game.debug.box2dWorld();
	
}