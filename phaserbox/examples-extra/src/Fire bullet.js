var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update:update, render: render });

function preload() {
    
    game.load.image('ship', 'assets/sprites/thrust_ship2.png');
    game.load.image('bullet', 'assets/sprites/shmup-bullet.png');
    
}

var ship;
var cursors;
var fireTimeout = 0;
var fireButton;
var bullets = [];

function create() {
    
    game.stage.backgroundColor = '#222222';
    
    // Enable Box2D physics
    game.physics.startSystem(Phaser.Physics.BOX2D);
    
    // Add the ship sprite
    ship = game.add.sprite(400, 300, 'ship');
    game.physics.box2d.enable(ship);
    ship.body.linearDamping = 0.5;
    
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    
    game.add.text(5, 5, 'Use arrow keys to move, Z to fire.', { fill: '#ffffff', font: '14pt Arial' });
};

function fireBullet() {
    
    // This position is first given in local coordinates of the ship sprite, 
    // then we convert it to a world position. The toWorldPoint takes into
    // account the position and rotation of the ship.
    var point = new box2d.b2Vec2(0, -26); // a bit in front of the ship, in the middle
    ship.body.toWorldPoint( point, point );
    
    // Create the bullet body and set the angle
    var bullet = game.add.sprite(point.x, point.y, 'bullet');
    game.physics.box2d.enable(bullet);
    bullet.body.angle = ship.body.angle - 90; // bullet is horizontal in the sprite image
    
    // Start the bullet moving in the same direction as the ship
    // is facing. The direction is first given in local coordinates
    // of the ship sprite, then we convert it to a world direction.
    var direction = new box2d.b2Vec2(0, -1); // up
    ship.body.toWorldVector( direction, direction );
    
    // Multiply direction by bullet speed
    direction.x *= 400;
    direction.y *= 400;
    
    // Add ship velocity to bullet velocity
    bullet.body.velocity.x = ship.body.velocity.x + direction.x;
    bullet.body.velocity.y = ship.body.velocity.y + direction.y;
    
    // Prevent the bullets from having collision response with other bodies
    bullet.body.sensor = true;
    
    // Add bullets to a list so we can remove them when they go offscreen
    bullets.push(bullet);
}

function update() {

    if (cursors.left.isDown)
    {
        ship.body.rotateLeft(300);
    }
    else if (cursors.right.isDown)
    {
        ship.body.rotateRight(300);
    }
    else {
        ship.body.setZeroRotation();
    }

    if (cursors.up.isDown)
    {
        ship.body.thrust(300);
    }
    else if (cursors.down.isDown)
    {
        ship.body.reverse(300);
    }
    
    if (fireButton.isDown && game.time.now > fireTimeout)
    {
        fireBullet();
        fireTimeout = game.time.now + 125;
    }

    // Destroy any bullets that go off screen
    for (var i = bullets.length - 1; i >= 0; i--) {
        var bullet = bullets[i];
        if ( bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 600 ) {
            bullet.destroy();
            bullets.splice(i,1);
        }
    }
}

function render() {

    //game.debug.box2dWorld();

}
