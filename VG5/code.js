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
var sky;
// preload game assets - runs once at start
function preload() {
	game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
	sky = game.load.image('sky', 'assets/images/sky-clouds.jpg', 0, 0);
	game.load.image('platform-50', 'assets/images/platform-050w.png');
	game.load.image('platform-100', 'assets/images/platform-100w.png');
	game.load.image('platform-200', 'assets/images/platform-200w.png');
	game.load.image('platform-300', 'assets/images/platform-300w.png');
	game.load.image('platform-400', 'assets/images/platform-400w.png');
	game.load.image('platform-500', 'assets/images/platform-500w.png');
}

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;

function create() {
	game.world.setBounds(0, 0, 5000, 600);
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.time.desiredFps = 30;

	bg = game.add.tileSprite(0, 0, 800, 600, 'sky');
	game.physics.arcade.gravity.y = 250;
	// PLATFORMS
	platformGroup = game.add.group();
	platformGroup.enableBody = true;

	// add ground platform
	var ground = platformGroup.create(0, game.world.height - 25, 'platform-500');
	ground.scale.setTo(10, 1); // 10 * 500 = 5000 pixels wide
	player = game.add.sprite(32, 32, 'dude');
	game.physics.enable(player, Phaser.Physics.ARCADE);

	player.body.bounce.x = 0.7;
	player.body.collideWorldBounds = true;
	player.body.setSize(20, 32, 5, 16);

	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('turn', [4], 20, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);

	cursors = game.input.keyboard.createCursorKeys();
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	game.camera.follow(player);
	sky.fixedToCamera = true;
}

function update() {

	// game.physics.arcade.collide(player, layer);
	player.body.velocity.x = 0;

	if (cursors.left.isDown) {
		player.body.velocity.x = -250;

		if (facing != 'left') {
			player.animations.play('left');
			facing = 'left';
		}
	} else if (cursors.right.isDown) {
		player.body.velocity.x = 250;

		if (facing != 'right') {
			player.animations.play('right');
			facing = 'right';
		}
	} else {
		if (facing != 'idle') {
			player.animations.stop();

			if (facing == 'left') {
				player.frame = 0;
			} else {
				player.frame = 5;
			}

			facing = 'idle';
		}
	}

	if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
		player.body.velocity.y = -250;
		jumpTimer = game.time.now + 750;
	}

}

// add custom functions (for collisions, etc.)
