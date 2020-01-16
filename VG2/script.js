// create Phaser.Game object assigned to global variable named game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'my-game', {
    preload: preload,
    create: create,
    update: update
});
// declare other global variables (for sprites, etc.)
var logo;
var hello1, hello2, hello3;
var spacebar;
var score = 0;
// preload game assets - runs one time when webpage first loads
function preload() {
    game.load.spritesheet('hello', 'assets/hello-sprite.png', 64, 64);
    game.load.audio('spin', 'assets/spinner.mp3');
    game.load.audio('doot', 'assets/doot.wav');
    game.load.audio('oof', 'assets/oofoof.wav');
    game.load.audio('coin', 'assets/coin.wav');
}
// create game world - runs one time after preload finishes
function create() {
    game.stage.backgroundColor = '#6699ff';
    hello1 = game.add.sprite(game.world.centerX - 100, game.world.centerY, 'hello');
    hello1.anchor.set(0.5, 0.5);
    hello2 = game.add.sprite(game.world.centerX, game.world.centerY, 'hello');
    hello2.anchor.set(0.5, 0.5);
    hello3 = game.add.sprite(game.world.centerX + 100, game.world.centerY, 'hello');
    hello3.anchor.set(0.5, 0.5);
    spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    spinSound = game.add.audio('spin', 0.4);
    match1Sound = game.add.audio('oof', 0.15)
    match2Sound = game.add.audio('coin', 0.7);
    match3Sound = game.add.audio('doot', 1000);
    spinSound.loop = true;
    scoreText = game.add.text(game.world.centerX, game.world.centerY + 80,
        'Use Spacebar to Spin', {
            font: 'Arial',
            fontSize: '20px',
            fontStyle: 'bold',
            fill: '#ffffff'
        });
    scoreText.anchor.set(0.5, 0.5);
    scoreText.setShadow(1, 1, '#000000', 2);
}
// update game - runs repeatedly in loop after create finishes
function update() {
    if (spacebar.justDown) {
        spinSound.play();
    } else if (spacebar.isDown) {
        hello1.frame = Math.floor(Math.random() * 6);
        hello2.frame = Math.floor(Math.random() * 6);
        hello3.frame = Math.floor(Math.random() * 6);
    } else if (spacebar.justUp) {
        spinSound.stop();
        checkMatch();
        game.stage.backgroundColor = Phaser.Color.getRandomColor();
    }
}
// add custom functions (for collisions, etc.) - only run when called
function checkMatch() {
    if (hello1.frame == hello2.frame && hello2.frame == hello3.frame) {
        // all 3 match
        score = score + 100;
        match3Sound.play();
        scoreText.text = score + " points nice one my dude";
    } else if (hello1.frame == hello2.frame || hello2.frame == hello3.frame ||
        hello1.frame == hello3.frame) {
        // any 2 match
        score = score + 20;
        match2Sound.play();
        scoreText.text = score + " points that's cool I guess";
    } else {
        // none match
        score = score - 10;
        match1Sound.play();
        scoreText.text = score + " points rip lol";
    }

}
