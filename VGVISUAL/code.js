var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
	create: create,
	update: update,
	render: render
});
game.antialias = false;
var screen = "game";
var groundBody = [0, 0];
var car = [golfCart, truck, apc, foodCart, atv, tank, nascar, hyperBike, monsterTruck, threeWheeler, dumpTruck, jeep, snowmobile, transportTruck, bus, hotrod, rover, racecar, carriage]; //Load all the cars
//var selection = 0; //CURRENTLY SELECTED CAR (PRESET)
var selection = Math.floor(Math.random() * 18); //CURRENTLY SELECTED CAR (RANDOM)

var vehicleVertices = [];
//Car selection
var Phaser;
var cursors;
var vehicleBody;
var partJoints2;
var com;
var bodySprite = car[selection];
var cameraScale = 2;
var score;
var score2 = 0;
var carName;
var partJoints = [];
var partJoints2 = [];

var cCar = car[selection]; //get body collision data for selected car
var cCarWheel = car[selection].carWheel; //get wheel data for selected car 
var cCarX;
var cCarY;
var cCarPart = car[selection].carParts; //get extra part data for selected car
var undefF;
var renSiz = 1;
/* for (var i9 = 0; i9 < (car.length) - 1; i9++) {
	for (var i = 0; i < car[i9].carVertices.length; i++) {
		//Let's take the constant factor as 2
		car[i9].carVertices[i] = car[i9].carVertices[i] * renSiz;
	}
	for (var i2 = 0; i2 < cCar.carNumParts; i2++) {
		for (var i = 0; i < cCarPart[i2].vertices.length; i++) {
			//Let's take the constant factor as 2
			car[i9].carParts[i2].vertices[i] = car[i9].carParts[i2].vertices[i] * renSiz;
		}
	}
} */

function create() {

	var caption = game.add.text(5, 5, 'Left/right arrow keys to choose car, Up/Down to zoom.', {
		fill: '#ffffff',
		font: '14pt Arial'
	});

	carName = game.add.text(5, 46, '', {
		fill: '#00ffff',
		font: '16pt Arial'
	});
	caption.fixedToCamera = true;
	carName.fixedToCamera = true;
	refresh();

}




// Make the ground body
function refresh() {
	cCar = car[selection]; //get body collision data for selected car
	cCarWheel = car[selection].carWheel; //get wheel data for selected car 
	cCarPart = car[selection].carParts; //get extra part data for selected car
	carName.text = cCar.name;
	game.world.setBounds(-500, -500, 1000, 1000);

	game.stage.backgroundColor = '#203050';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.gravity.y = 0;
	game.physics.box2d.friction = 1;
	game.physics.box2d.restitution = 0;

	cursors = game.input.keyboard.createCursorKeys();


	// Make the car body

	vehicleVertices = cCar.carVertices;
	for (var i = 0; i < vehicleVertices.length; i++) {
		//Let's take the constant factor as 2
		vehicleVertices[i] = vehicleVertices[i] * renSiz;
	}

	vehicleBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
	vehicleBody.setPolygon(vehicleVertices);
	vehicleBody.mass = (cCar.carMass * 0.45);
	vehicleBody.setCollisionMask(0);
	vehicleBody.autoCull = false;
	//Massdata = vehicleBody.getMass(); //get the mass data from you body
	/** Set the position of the shape's centroid relative to the shape's origin. **/
	cCarX = vehicleBody.x;
	cCarY = vehicleBody.y;




	var wheelBodies = [];

	for (var i7 = 0; i7 < cCar.carNumWheels; i7++) {
		cCarWheel[i7].size = cCarWheel[i7].size * renSiz;
		cCarWheel[i7].xPos = cCarWheel[i7].xPos * renSiz;
		wheelBodies[i7] = new Phaser.Physics.Box2D.Body(this.game, null, (cCarWheel[i7].xPos), cCarWheel[i7].height + 100, 0);
		wheelBodies[i7].setCircle(cCarWheel[i7].size);
		wheelBodies[i7].friction = cCarWheel[i7].grip;
		wheelBodies[i7].mass = cCarWheel[i7].mass;
		wheelBodies[i7].setCollisionMask(0);
		wheelBodies[i7].autoCull = false;
		wheelBodies[i7].enable = false;
		//wheelBodies[i].restitution = cCarWheel[i].bounce - 1;
	}

	var motorTorque = cCar.carPower;

	// Make wheel joints
	// bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled	
	for (var i4 = 0; i4 < cCar.carNumWheels; i4++) {
		cCarWheel[i4].height = cCarWheel[i4].height * renSiz;
		wheelBodies[i4].x = cCarWheel[i4].xPos * renSiz;
		wheelBodies[i4].y = cCarWheel[i4].height * renSiz;

	}

	var partBodies = [0, 0, 0, 0, 0];

	// create extra parts

	for (var i2 = 0; i2 < cCar.carNumParts; i2++) {
		var ppp = cCarPart[i2].vertices;
		partBodies[i2] = new Phaser.Physics.Box2D.Body(this.game, null, (cCarX + cCarPart[i2].xPos) * renSiz, (cCarY + cCarPart[i2].yPos) * renSiz, 2);
		for (var i11 = 0; i11 < ppp.length; i11++) {
			cCarPart[i2].vertices[i11] = cCarPart[i2].vertices[i11] * renSiz;
		}
		console.log(cCarPart[i2].vertices);
		partBodies[i2].setPolygon(cCarPart[i2].vertices);
		partBodies[i2].setCollisionMask(0);
		partBodies[i2].autoCull = false;
		partBodies[i2].setCollisionMask(0);
		partBodies[i2].enable = false;
	}
	game.camera.follow(vehicleBody);
	carName.text = "ID: " + selection + "   Name: " + cCar.name;
	vehicleBody.setZeroRotation();
	vehicleBody.antialias = true;
	wheelBodies.antialias = true;
	partBodies.antialias = true;
}





function update() {

	if (cursors.up.justDown) {
		renSiz = renSiz * (5 / 4);
		refresh();
		renSiz = renSiz * (4 / 5);
		refresh();
	}
	if (cursors.down.justDown) {
		renSiz = renSiz * (4 / 5);
		refresh();
		renSiz = renSiz * (5 / 4);
		refresh();
	}
	if (cursors.left.justDown && !cursors.right.justDown && selection >= 1) {
		selection = selection - 1;
		refresh();
		carName.text = "ID: " + selection + "       Name: " + cCar.name;
	}
	if (cursors.right.justDown && !cursors.left.justDown && selection <= car.length - 1) {
		selection = selection + 1;
		refresh();
		carName.text = "ID: " + selection + "       Name: " + cCar.name;
	} // roll if no keys pressed
}



function render() {

	game.debug.box2dWorld();

}
