
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {
    game.load.image('block', 'assets/sprites/block.png');
}

var downX;
var isDown;
var box;
function create() {
	isDown = false;
    
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
    
    
    game.add.text(5, 5, 'Click on the box and drag left or right to make it rotate', { fill: '#ffffff', font: '14pt Arial' });
    
    
    //Create a box sprite with a box2d body
    box = game.add.sprite(game.world.centerX, game.world.centerY, 'block');
    game.physics.box2d.enable(box);
    
    //add input Down and Up events to the box
    box.inputEnabled = true;
    box.events.onInputDown.add(onDown, this);
    box.events.onInputUp.add(onUp, this);
    
    //add a callback function that's called whenever the mouse moves.
    game.input.addMoveCallback(mouseMoved, this);
    
}

//This function uses the mouses x position to calculate how fast and which direction the box should rotate. 
function mouseMoved(pointer) {
    
    if (isDown) {
        //calculate how far the mouse has been dragged in the x direction
        dragX = pointer.x - downX;
        
        //if the mouse was dragged to the right, rotate the box to the right
        if (dragX > 0) {
            box.body.rotateRight(dragX);
        } else if (dragX < 0) { //if the mouse was dragged to the left, rotate the box to the left
            box.body.rotateLeft(Math.abs(dragX));
        }
        //if the box isn't being dragged then stop rotating it
    } else {
        box.body.setZeroRotation();   
    }
    
}

function onDown(sprite) {
    isDown = true;
    
    //store the x coordinate of the mouse at the time of the onDown event
    downX = game.input.x;
}

function onUp(sprite) {
    isDown = false;
    downX = 0;
}
