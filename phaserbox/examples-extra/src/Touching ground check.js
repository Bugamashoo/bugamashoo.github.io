
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.image('platform', 'assets/sprites/platform.png');
    game.load.image('player', 'assets/sprites/phaser-dude.png');

}

var player;
var touchingCount = 0;
var caption;

function create() {

    game.stage.backgroundColor = '#124184';
    
    // Enable Box2D physics
    game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.setBoundsToWorld();
	game.physics.box2d.gravity.y = 500;
	
	// Static platform 
	platformSprite = game.add.sprite(400, 450, 'platform');
	game.physics.box2d.enable(platformSprite);
	platformSprite.body.static = true;
    
    // Create player
    player = game.add.sprite(400, 300, 'player');
    game.physics.box2d.enable(player);
    player.body.fixedRotation = true;
    
    // Create a foot-sensor fixture
    var footSensor = player.body.addCircle(8,0,20);
    footSensor.SetSensor(true);
    
    // Set up callbacks so we are informed when sensor touches something
    player.body.setFixtureContactCallback(footSensor,  leftCallback,  this);
        
    game.add.text(5,  5, 'Sensor fixture below player detects when touching ground.', { fill: '#ffffff', font: '14pt Arial' });
    caption = game.add.text(5,  25, '', { fill: '#ccffcc', font: '14pt Arial' });
    
    updateCaption();

	// Set up handlers for mouse events
	game.input.onDown.add(mouseDragStart, this);
	game.input.addMoveCallback(mouseDragMove, this);
	game.input.onUp.add(mouseDragEnd, this);
}

function mouseDragStart() { game.physics.box2d.mouseDragStart(game.input.mousePointer); }
function mouseDragMove() {  game.physics.box2d.mouseDragMove(game.input.mousePointer); }
function mouseDragEnd() {   game.physics.box2d.mouseDragEnd(); }

function updateCaption() {
	
	// We can look at the touchingCount variable any time to check if the sensor is
	// touching more than zero things - if so, then the player is on the ground 
    caption.text =  "Touching: " + (touchingCount > 0 ? 'yes':'no');
}

// body1 is the player because it's the body that owns the callback
function leftCallback(body1, body2, fixture1, fixture2, begin) {
	
	// If begin is true this is a begin contact, otherwise a contact has just ended
    touchingCount += (begin ? 1 : -1);
    updateCaption();
}

function render() {

    game.debug.box2dWorld();
    
}