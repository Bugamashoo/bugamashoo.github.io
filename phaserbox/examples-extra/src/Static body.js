
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ship', 'assets/sprites/xenon2_ship.png');
    game.load.image('atari', 'assets/sprites/atari130xe.png');

}

var sprite;
var cursors;

function create() {
    
    game.stage.backgroundColor = '#124184';

    // Enable Box2D physics
    game.physics.startSystem(Phaser.Physics.BOX2D);

    // Add a sprite
    sprite = game.add.sprite(400, 300, 'ship');
    game.physics.box2d.enable(sprite);
    sprite.body.linearDamping = 0.5;

    //  Create two static objects
    var static1 = game.add.sprite(200, 200, 'atari');
    var static2 = game.add.sprite(500, 500, 'atari');

    // Enable physics. This creates a default rectangular body.
    game.physics.box2d.enable( [ static1, static2 ]);

    //  Make static
    static1.body.static = true;
    static2.body.static = true;

    game.add.text(5, 5, 'Use arrow keys to move.', { fill: '#ffffff', font: '14pt Arial' });

    cursors = game.input.keyboard.createCursorKeys();

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

}

function render() {
    
    game.debug.box2dWorld();
    
}
