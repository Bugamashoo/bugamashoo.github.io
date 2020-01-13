// create Phaser.Game object assigned to global variable named game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'my-game', {
    preload: preload,
    create: create,
    update: update
});

// declare other global variables (for sprites, etc.)
var logo;
var spacebar;
var epilepsy = false;
// preload game assets - runs one time when webpage first loads
function preload() {
    game.load.image('phaser-logo', 'assets/phaser.png');
    spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    fKey = game.input.keyboard.addKey(Phaser.KeyCode.F);
}

// create game world - runs one time after preload finishes
function create() {
    logo = game.add.image(400, 300, 'phaser-logo');
    logo.anchor.setTo(0.5, 0.5);
}

// update game - runs repeatedly in loop after create finishes
function update() {
    if (spacebar.justDown || epilepsy == true) {
        game.stage.backgroundColor = Phaser.Color.getRandomColor();
    }
    if (fKey.justDown) {
        if (epilepsy == false) {
            epilepsy = true
        } else {
            epilepsy = false
        }
    }
}

// add custom functions (for collisions, etc.) - only run when called
