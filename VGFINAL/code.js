var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
	create: create,
	update: update,
	render: render
});

var car = [golfCart, truck, apc, foodCart, atv, tank, nascar, hyperBike, monsterTruck, threeWheeler, dumpTruck, jeep, snowmobile]; //Load all the cars
//var selection = 12; //CURRENTLY SELECTED CAR (PRESET)
var selection = Math.floor(Math.random() * 13); //CURRENTLY SELECTED CAR (RANDOM)

var vehicleVertices = [];
//Car selection
var Phaser;
var cursors;
var vehicleBody;
var com;
var comCam;
var flipr2;
var bodySprite = car[selection];
var cameraScale = 2;

var sSelection = 0; //Stage selection
var groundVertices;

//upgrades
var susUp;
var tirUp;


var cCar = car[selection]; //get body collision data for selected car
var cCarWheel = car[selection].carWheel; //get wheel data for selected car 
var cCarX;
var cCarY;
var cCarPart = car[selection].carParts; //get extra part data for selected car
var driveJoints = [];
var partJoints = [];
var partJoints2 = [];

function create() {

	var caption = game.add.text(5, 5, 'Left/right arrow keys to move, up arrow to reset.', {
		fill: '#ffffff',
		font: '14pt Arial'
	});
	caption.fixedToCamera = true;
	refresh();
}
// Make the ground body
function refresh() {

	game.world.setBounds(-10000, -10000, 50000, 50000);

	game.stage.backgroundColor = '#203050';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.gravity.y = 320;
	game.physics.box2d.friction = 0.25;
	game.physics.box2d.restitution = 0;

	cursors = game.input.keyboard.createCursorKeys();
	var groundBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
	groundBody.setChain(groundVertices[sSelection].data);


	var jointAnchor = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0); //car limit physics
	jointAnchor.setPolygon[10, 10, 10, -10, -10, -10, -10, 10];


	// Make the car body
	vehicleVertices = cCar.carVertices;
	vehicleBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, -40);
	vehicleBody.setPolygon(vehicleVertices);
	vehicleBody.mass = (cCar.carMass * 0.4);

	//Massdata = vehicleBody.getMass(); //get the mass data from you body
	/** Set the position of the shape's centroid relative to the shape's origin. **/
	cCarX = vehicleBody.x;
	cCarY = vehicleBody.y;
	com = new Phaser.Physics.Box2D.Body(this.game, null, cCarX + cCar.carMassX, cCarY + cCar.carMassY)
	com.setCircle(2.5);
	com.mass = (cCar.carMass * 0.6);
	game.physics.box2d.weldJoint(vehicleBody, com, cCarX + cCar.carMassX, cCarY + cCar.carMassY)
	console.log(com);
	//comCam = new Phaser.Physics.Box2D.Body(this.game, null, cameraScale * 400, cameraScale * -300)
	//game.physics.box2d.weldJoint(vehicleBody, comCam, (cameraScale * 400), (cameraScale * -300))

	//data.center.set(10, 10);
	//vehicleBody.setMassData(data);
	// bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
	flipr = game.physics.box2d.motorJoint(jointAnchor, vehicleBody, cCar.airResist * 0.001, cCar.tilt, 0);

	// bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled
	flipr2 = game.physics.box2d.wheelJoint(jointAnchor, vehicleBody, null, null, null, null, null, null, null, null, 5, 1, cCar.agility, true)
	// Make the wheel bodies



	var wheelBodies = [];
	for (var i = 0; i < cCar.carNumWheels; i++) {
		wheelBodies[i] = new Phaser.Physics.Box2D.Body(this.game, null, cCarWheel[i].xPos, cCarWheel[i].height - 30, 2);
		wheelBodies[i].setCircle(cCarWheel[i].size);
		wheelBodies[i].friction = cCarWheel[i].grip;
		wheelBodies[i].mass = cCarWheel[i].mass;
	}

	var motorTorque = cCar.carPower;

	// Make wheel joints
	// bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled	
	for (var i4 = 0; i4 < cCar.carNumWheels; i4++) {
		driveJoints[i4] = game.physics.box2d.wheelJoint(vehicleBody, wheelBodies[i4], cCarWheel[i4].xPos, cCarWheel[i4].height, 0, 0, cCarWheel[i4].susAngle + 0, 1, cCarWheel[i4].springs, cCarWheel[i4].damping, 0, motorTorque * cCarWheel[i4].active, true);
	}

	var partBodies = [];
	// create extra parts

	for (var i2 = 0; i2 < cCar.carNumParts; i2++) {
		partBodies[i2] = new Phaser.Physics.Box2D.Body(this.game, null, cCarPart[i2].xPos, cCarPart[i2].yPos);
		partBodies[i2].setPolygon(cCarPart[i2].vertices);
		partBodies[i2].mass = cCarPart[i2].mass;
		partBodies[i2].friction = cCarPart[i2].grip;
	}
	for (var i5 = 0; i5 < cCar.carNumParts; i5++) {
		// bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
		if (cCarPart[i5].partType == 0) {
			partJoints[i5] = game.physics.box2d.revoluteJoint(vehicleBody, partBodies[i5], cCarPart[i5].xPos + cCarPart[i5].xOff, cCarPart[i5].yPos + cCarPart[i5].yOff, cCarPart[i5].xOff, cCarPart[i5].yOff, null, null, false, cCarPart[i5].limCounterclockwise, cCarPart[i5].limClockwise, true);
			partJoints2[i5] = game.physics.box2d.motorJoint(vehicleBody, partBodies[i5], null, cCarPart[i5].spring, cCarPart[i5].torque, 0, cCarPart[i5].correctionAngle, cCarPart[i5].correctionAngle);
		} else
			// bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
			if (cCarPart[i5].partType == 2) {
				partJoints2[i5] = game.physics.box2d.motorJoint(vehicleBody, partBodies[i5], cCarPart[i5].xPos, cCarPart[i5].yPos, cCarPart[i5].xOff, cCarPart[i5].yOff, cCarPart[i5].spring, cCarPart[i5].torque)
			} else
				// bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
				if (cCarPart[i5].partType == 1) {
					partJoints2[i5] = game.physics.box2d.weldJoint(vehicleBody, partBodies[i5], cCarPart[i5].xPos + cCarPart[i5].xOff, cCarPart[i5].yPos + cCarPart[i5].yOff, cCarPart[i5].xOff, cCarPart[i5].yOff, cCarPart[i5].spring, cCarPart[i5].torque)
				}
	}

	game.camera.follow(com);
	console.log(comCam);
	console.log(game.camera);
}

function update() {

	var thrustP = 100;
	var motorSpeed = cCar.carMaxSpeed; // rad/s
	var turnSpeed = 1 + cCar.agility;
	var motorEnabled = true;
	if (cursors.up.isDown) {
		if (selection >= 6) {
			selection = 0;
		} else {
			selection++;
		}
		refresh();
	}
	vehicleBody.reverse(thrustP * 0.5);
	com.reverse(thrustP * 0.5);
	if (cursors.down.isDown) {
		//motorEnabled;

		//console.log(com);

	} // prioritize braking
	else if (cursors.left.isDown && !cursors.right.isDown) {
		motorSpeed *= -1;
		turnSpeed *= -1;
		vehicleBody.speed;
	} else if (cursors.right.isDown && !cursors.left.isDown) {} else {
		motorEnabled = false;
	} // roll if no keys pressed

	for (var i3 = 0; i3 < cCar.carNumWheels; i3++) {
		driveJoints[i3].EnableMotor(motorEnabled);
		flipr2.EnableMotor(motorEnabled);
		driveJoints[i3].SetMotorSpeed(motorSpeed * cCarWheel[i3].active);
		flipr2.SetMotorSpeed(turnSpeed * -1)
	}
}

function render() {

	game.debug.box2dWorld();

}
