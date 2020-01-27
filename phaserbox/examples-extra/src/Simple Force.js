
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render, update: update });

function preload() {

    game.load.image('ball', 'assets/sprites/shinyball.png');
    game.load.image('platform', 'assets/sprites/platform.png');

}

var downX = 0;
var downY = 0;
var dragX;
var dragY;
var isDown;
var ball;
var caption;

function create() {
    
	game.stage.backgroundColor = '#124184';

	game.physics.startSystem(Phaser.Physics.BOX2D);
    
	game.physics.box2d.gravity.y = 500;
    game.physics.box2d.setBoundsToWorld();
    game.physics.box2d.restitution = 0.1;
    
    game.add.text(5, 5, 'Click on the ball and drag in any direction.\nWhen you let go a force will be applied in the same direction that you are dragging.\nThe further you drag, the more force.', { fill: '#ffffff', font: '14pt Arial' });
    
    caption = game.add.text(5, 90, 'Force: ', { fill: '#ffff00', font: '14pt Arial' });
    
    //  Create a static platform
    var ground = game.add.sprite(game.world.centerX, 550, 'platform');
    game.physics.box2d.enable(ground);
    ground.body.static = true;
    
    //  Create a ball with circle body
    ball = game.add.sprite(game.world.centerX, 500, 'ball');
    game.physics.box2d.enable(ball);
    ball.body.setCircle(ball.width / 2);
    
    //  Add input Down and Up events to the ball
    ball.inputEnabled = true;
    ball.events.onInputDown.add(onDown, this);
    ball.events.onInputUp.add(onUp, this);
    
}

function update() {

    if (isDown)
    {
        caption.text = 'Force: x: ' + (game.input.x - downX) + ',  y: ' + (game.input.y - downY);
    }

}

function onDown(sprite) {

    isDown = true;

    downX = game.input.x;
    downY = game.input.y;
}

function onUp(sprite) {

    isDown = false;

    //calculate the distance the mouse has been dragged
    dragX = game.input.x - downX;
    dragY = game.input.y - downY;
    
    //Apply a single force to the center of the ball. use dragX and dragY to calculate the amount of force to apply on x and y axis.
    ball.body.applyForce(dragX, dragY);
}

function render() {
	
	game.debug.box2dWorld();
	
}
