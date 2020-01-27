
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('stars', 'assets/misc/starfield.jpg');
    game.load.image('ball', 'assets/sprites/shinyball.png');
    game.load.spritesheet('ship', 'assets/sprites/humstar.png', 32, 32);

}

var ship;
var starfield;
var cursors;

function create() {

    game.world.setBounds(0, 0, 1600, 1200);

    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.restitution = 0.9;

    starfield = game.add.tileSprite(0, 0, 800, 600, 'stars');
    starfield.fixedToCamera = true;

    balls = game.add.group();
    balls.enableBody = true;
    balls.physicsBodyType = Phaser.Physics.BOX2D;

    for (var i = 0; i < 50; i++)
    {
        var ball = balls.create(game.world.randomX, game.world.randomY, 'ball');
        ball.body.setCircle(16);
    }

    ship = game.add.sprite(200, 200, 'ship');
    ship.scale.set(2);
    ship.smoothed = false;
    ship.animations.add('fly', [0,1,2,3,4,5], 10, true);
    ship.play('fly');

    // Create our physics body - a 28px radius circle.
    game.physics.box2d.enable(ship, false);
    ship.body.fixedRotation = true;
    ship.body.setCircle(28);

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();
    
    game.add.text(5, 5, 'Use arrow keys to move.', { fill: '#ffffff', font: '14pt Arial' });
    
}

function update() {

    ship.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
	ship.body.moveLeft(200);
    }
    else if (cursors.right.isDown)
    {
	ship.body.moveRight(200);
    }

    if (cursors.up.isDown)
    {
    	ship.body.moveUp(200);
    }
    else if (cursors.down.isDown)
    {
        ship.body.moveDown(200);
    }

    if (!game.camera.atLimit.x)
    {
        starfield.tilePosition.x += -ship.body.velocity.x * game.time.physicsElapsed;
    }

    if (!game.camera.atLimit.y)
    {
        starfield.tilePosition.y += -ship.body.velocity.y * game.time.physicsElapsed;
    }

}

function render() {

    game.debug.box2dWorld();
    
}