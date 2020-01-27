
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, render: render });

var testVerts1 = [-10, -20, 20, 60, 35, -30, -20, -50, -40, 20, -10, 20];
var testVerts2 = [71,-87,61,-46,109,-60,122,-46,96,0,107,76,77,124,78,
				  32,10,80,-7,40,-51,118,-145,32,-109,-6,-43,16,43,-15,
				  26,-30,-60,-5,-127,-54,-98,-97,-30,-61,29,-91];

function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
		
	// Make some bodies (no fixtures to start with)
	var bodies = [];
	bodies[0] = new Phaser.Physics.Box2D.Body(this.game, null, 200, 200, 0);
	bodies[1] = new Phaser.Physics.Box2D.Body(this.game, null, 200, 450, 0);
	bodies[2] = new Phaser.Physics.Box2D.Body(this.game, null, 550, 200, 0);
	bodies[3] = new Phaser.Physics.Box2D.Body(this.game, null, 550, 450, 0);

	// Add fixtures
	bodies[0].setChain( testVerts1 );
	bodies[1].setPolygon( testVerts1 );
	bodies[2].setChain( testVerts2 );
	bodies[3].setPolygon( testVerts2 );

	game.add.text(5,  5, 'Polygon decomposition. The polygons use the same vertices as the chains above them.', { fill: '#ffffff', font: '14pt Arial' });
	game.add.text(5, 25, 'The segments of the chain can be wound either way, but must not overlap each other.', { fill: '#ffffff', font: '14pt Arial' });
	
}

function render() {

	game.debug.box2dWorld();

}
