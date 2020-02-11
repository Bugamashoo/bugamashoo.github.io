// create Phaser.Game object named "game"
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'my-game', {
	preload: preload,
	create: create,
	update: update
});

// declare global variables for game
var cursors;
var player;
var Phaser;
// preload game assets - runs once at start
function preload() {
	game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
}

// create game world - runs once after "preload" finished
function create() {
	cursors = game.input.keyboard.createCursorKeys();
	game.physics.startSystem(Phaser.Physics.ARCADE);
	player = game.add.sprite(25, 300, 'dude');
	player.anchor.setTo(0.5, 0.5);
	game.physics.arcade.enable(player);
	player.body.gravity.y = 313.6;
	player.body.bounce.y = 1.1;
	player.body.bounce.x = 0.5;
	player.body.collideWorldBounds = true;
}

// update gameplay - runs in continuous loop after "create" finished
function update() {

	if (cursors.right.isDown) {
		player.body.velocity.x = player.body.velocity.x + 10;
	} else if (cursors.left.isDown) {
		player.body.velocity.x = player.body.velocity.x - 10;
	} else {
		player.body.velocity.x = player.body.velocity.x / 1.05;
	}
}

// add custom functions (for collisions, etc.)
