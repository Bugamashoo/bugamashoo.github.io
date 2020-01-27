
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render, update: update });

function preload() {
    game.load.image('a', 'assets/sprites/a.png');
	game.load.image('b', 'assets/sprites/b.png');
}


var spriteB;
var forceText;
var maxForceText;
var cursors;
var joint;
function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
    
    game.physics.box2d.setBoundsToWorld();
    game.physics.box2d.debugDraw.joints = true;
    
    game.physics.box2d.restitution = 0.5;
    game.physics.box2d.gravity.y = 500;
    
    //disable sleeping so when the user changes MaxForce value with arrow keys they can see how it effects the body right away
    game.physics.box2d.world.SetAllowSleeping(false);
    
    // Static box to connect one side of the friction joint to
    var spriteA = game.add.sprite(game.world.centerX, game.world.centerY, 'a');
	game.physics.box2d.enable(spriteA);
    spriteA.body.static = true;
		
    // Dynamic box to connect to the other side of the friction joint
	spriteB = game.add.sprite(game.world.centerX, game.world.centerY, 'b');
	game.physics.box2d.enable(spriteB);
		
	// bodyA, bodyB, maxForce, maxTorque, ax, ay, bx, by
	joint = game.physics.box2d.frictionJoint(spriteA, spriteB, 50, 0);
		
    //Text to tell user how to use this example
    game.add.text(5, 10, 'Friction Joint - Linear friction only. Click and drag Box B, then release mouse button to apply force ', { fill: '#ffffff', font: '13pt Arial' });
    game.add.text(5, 30, 'Use the up and down arrow keys to change the MaxForce parameter of the friction joint', { fill: '#ffffff', font: '13pt Arial' });
   
    //Text to display force to be applied to box from click+drag
    forceText = game.add.text(game.world.centerX, 100, 'Force: (0, 0)', { fill: '#ccffcc', font: '14pt Arial' });
    forceText.anchor.set(0.5);
    
    //Text to display the current MaxForce property of the friction joint
    maxForceText = game.add.text(game.world.centerX, 75, 'Friction joint MaxForce: ' + joint.GetMaxForce(), { fill: '#ccffcc', font: '14pt Arial' });
    maxForceText.anchor.set(0.5);
    
    //input callbacks to keep track of mouse drags
    game.input.onDown.add(mouseDragStart, this);
	game.input.addMoveCallback(mouseDragMove, this);
	game.input.onUp.add(mouseDragEnd, this);
    
    //arrow key input
    cursors = game.input.keyboard.createCursorKeys();
}


var pressed = false;
function update() {
    
    //Increase max force when up is pressed.
	if (cursors.up.isDown) {
        if (!pressed) {
            joint.SetMaxForce(joint.GetMaxForce() + 5);
            maxForceText.text = 'Friction joint MaxForce: ' + joint.GetMaxForce();
            pressed = true;
        }
    } else if (cursors.down.isDown) { //Decrease when down is pressed
        if (!pressed) {
            joint.SetMaxForce(joint.GetMaxForce() - 5);
            maxForceText.text = 'Friction joint MaxForce: ' + joint.GetMaxForce();
            pressed = true;
        }
    } else {
        pressed = false;
    }
	
}

//flag to keep track of whether spriteB is being clicked+dragged
var dragging;

//coords for the start point of mouse drag motion
var dragStart = new box2d.b2Vec2(0, 0);

//2d vector to keep track of the distance between drag start and current pointer location, used to calculate force applied to box when mouse button is released
var forceVec = new box2d.b2Vec2(0, 0);

//when mouse button is pressed check if pointer overlaps spriteB, if so start recording drag and set dragStart coords
function mouseDragStart() 
{ 
    if (spriteB.body.containsPoint(game.input.mousePointer)) {
        dragging = true;
        dragStart.x = game.input.mousePointer.x;
        dragStart.y = game.input.mousePointer.y;
    }
        
}

//if dragging=true update forceVec coords and forceText based on mouse position
function mouseDragMove() 
{  
    if (dragging) {
        forceVec.x = game.input.mousePointer.x - dragStart.x;
        forceVec.y = game.input.mousePointer.y - dragStart.y;
        forceText.text = 'Force: (' + forceVec.x + ', ' + forceVec.y + ')';
    }
}

//when mouse butotn is released, check if dragging is true and if so complete the drag motion by applying force to spriteB and setting dragging=false
function mouseDragEnd()
{   
    if (dragging) {
        dragging = false;
        spriteB.body.applyForce(forceVec.x * 10, forceVec.y * 10);
        forceVec.x = forceVec.y = 0;
        forceText.text = 'Force: (' + forceVec.x + ', ' + forceVec.y + ')';
        
    }
}

function render() {
	
	game.debug.box2dWorld();
	
}
