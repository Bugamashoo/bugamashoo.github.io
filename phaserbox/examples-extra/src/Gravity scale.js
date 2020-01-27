
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('ball', 'assets/sprites/shinyball.png');

}

function create() {

    game.stage.backgroundColor = '#124184';

    // Enable Box2D physics
    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.setBoundsToWorld();
    game.physics.box2d.gravity.y = 300;
    game.physics.box2d.restitution = 0.8;

    var sprite1 = game.add.sprite(200, 100, 'ball');
    var sprite2 = game.add.sprite(400, 100, 'ball');
    var sprite3 = game.add.sprite(600, 100, 'ball');

    //  Enable for physics. This creates a default rectangular body.
    game.physics.box2d.enable([ sprite1, sprite2, sprite3 ]);
    
    //  Adjust the gravity scale
    sprite1.body.gravityScale = 1;
    sprite2.body.gravityScale = 0.5;
    sprite3.body.gravityScale = 0.25;

    game.add.text(5, 5, 'Different gravity scales for bodies.', { fill: '#ffffff', font: '14pt Arial' });
}
