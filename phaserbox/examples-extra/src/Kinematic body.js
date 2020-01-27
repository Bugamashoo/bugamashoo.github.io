
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ship', 'assets/sprites/xenon2_ship.png');
    game.load.image('atari', 'assets/sprites/atari130xe.png');

}

var kinematic1;
var kinematic2;
var sprite;
var cursors;
var stepCount = 0;

function create() {

    game.stage.backgroundColor = '#124184';

    // Enable Box2D physics
    game.physics.startSystem(Phaser.Physics.BOX2D);

    // Add a sprite
    sprite = game.add.sprite(400, 300, 'ship');
    game.physics.box2d.enable(sprite);
    sprite.body.linearDamping = 0.5;

    // Create two kinematic objects
    kinematic1 = game.add.sprite(200, 200, 'atari');
    kinematic2 = game.add.sprite(400, 500, 'atari');
    game.physics.box2d.enable( [ kinematic1, kinematic2 ]);
    kinematic1.body.kinematic = true;
    kinematic2.body.kinematic = true;

    // Give one of the kinematic objects some velocity. The other one
    // will have its velocity continually adjusted in the update function.
    kinematic1.body.velocity.x = 50;

    // Change the directions of one of the kinematic objects after 10 seconds
    game.time.events.loop(Phaser.Timer.SECOND * 10, switchDirection, this);

    cursors = game.input.keyboard.createCursorKeys();
    
    game.add.text(5, 5, 'Use arrow keys to move.', { fill: '#ffffff', font: '14pt Arial' });

}

function update() {

    if (cursors.left.isDown)
    {
    	sprite.body.rotateLeft(200);
    }
    else if (cursors.right.isDown)
    {
    	sprite.body.rotateRight(200);
    }
    else
    {
        sprite.body.setZeroRotation();
    }

    if (cursors.up.isDown)
    {
    	sprite.body.thrust(200);
    }
    else if (cursors.down.isDown)
    {
    	sprite.body.reverse(200);
    }

    // Give the lower kinematic body a sine/cosine style movement.
    stepCount += 1;
    kinematic2.body.velocity.x = 200 * Math.cos(0.015 * stepCount);
}

function switchDirection() {
    
    // Reverse the direction of the upper kinematic body
    kinematic1.body.velocity.x = -kinematic1.body.velocity.x;
    
}

function render() {
    
    game.debug.box2dWorld();
    
}

