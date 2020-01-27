
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

	game.load.image('firstaid', 'assets/sprites/firstaid.png');
	game.load.image('contra2', 'assets/pics/contra2.png');

	// Load our physics data exported from PhysicsEditor
	game.load.physics('physicsData', 'assets/physics/sprites.json');

}

function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.gravity.y = 500;
	game.physics.box2d.setBoundsToWorld();
	
	// 'contra' sprite
	var sprite = game.add.sprite(400, 300, 'contra2');
	game.physics.box2d.enable(sprite);
	sprite.body.static = true;

	// Clear the shapes and load the 'contra2' polygon from the physicsData JSON file in the cache
	sprite.body.clearFixtures();
	sprite.body.loadPolygon('physicsData', 'contra2', sprite);

	// Drop some dynamic bodies on to illustrate the concave part
	for (var i = 0; i < 3; i++) {
		var dynamicSprite = game.add.sprite(380 + i * 20, 50 + i * 50, 'firstaid');
		game.physics.box2d.enable(dynamicSprite);
		dynamicSprite.body.friction = 0.8;
	}
	
	game.add.text(5, 5, 'Concave shape is exported from PhysicsEditor.', { fill: '#ffffff', font: '14pt Arial' });
}

function render() {

	game.debug.box2dWorld();

}
