var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
	create: create,
	update: update,
	render: render
});

var car = [golfCart, truck, apc, foodCart, atv, tank, nascar, hyperBike]; //Load all the cars
var selection = 7;
var vehicleVertices = [];
//Car selection

var sSelection = 0; //Stage selection
var groundVertices;

//upgrades
var susUp;
var tirUp;

var cCar = car[selection]; //get body collision data for selected car
var cCarWheel = car[selection].carWheel; //get body collision data for selected car 
var driveJoints = [];

function create() {

	var caption = game.add.text(5, 5, 'Left/right arrow keys to move, down arrow key to brake, up arrow to reset.', {
		fill: '#ffffff',
		font: '14pt Arial'
	});
	caption.fixedToCamera = true;
	refresh();
}
// Make the ground body
function refresh() {

	game.world.setBounds(-10000, -10000, 20000, 20000);

	game.stage.backgroundColor = '#203050';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.gravity.y = 320;
	game.physics.box2d.friction = 0.3;

	cursors = game.input.keyboard.createCursorKeys();
	var groundBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
	groundBody.setChain(groundVertices[sSelection].data);


	var jointAnchor = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0); //car limit physics
	jointAnchor.setPolygon[10, 10, 10, -10, -10, -10, -10, 10];

	var PTM = 50 * cCar.carPTM;

	// Make the car body
	vehicleVertices = cCar.carVertices;
	vehicleBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, -40);
	vehicleBody.setPolygon(vehicleVertices);
	vehicleBody.mass = cCar.carMass;

	// bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
	flipr = game.physics.box2d.motorJoint(jointAnchor, vehicleBody, cCar.airResist * 0.001, cCar.tilt, 0);

	// bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled
	flipr2 = game.physics.box2d.wheelJoint(jointAnchor, vehicleBody, null, null, null, null, null, null, null, null, 5, 1, true)
	// Make the wheel bodies



	var wheelBodies = [];
	for (var i = 0; i < cCar.carNumWheels; i++) {
		wheelBodies[i] = new Phaser.Physics.Box2D.Body(this.game, null, cCarWheel[i].xPos, cCarWheel[i].height - 10, 2);
		wheelBodies[i].setCircle(cCarWheel[i].size);
		wheelBodies[i].friction = cCarWheel[i].grip;
		wheelBodies[i].mass = cCarWheel[i].mass;
	}


	var motorTorque = cCar.carPower;

	// Make wheel joints
	// bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled	
	for (var i = 0; i < cCar.carNumWheels; i++) {
		driveJoints[i] = game.physics.box2d.wheelJoint(vehicleBody, wheelBodies[i], cCarWheel[i].xPos, cCarWheel[i].height, 0, 0, 0, 1, cCarWheel[i].springs, cCarWheel[i].damping, 0, motorTorque * cCarWheel[i].active, true);
	}



	game.camera.follow(vehicleBody);

}

function update() {


	var motorSpeed = cCar.carMaxSpeed; // rad/s
	var turnSpeed = 2.5;
	var motorEnabled = true;
	if (cursors.up.isDown) {
		if (selection >= 6) {
			selection = 0;
		} else {
			selection++;
		}
		refresh();
	}
	if (cursors.down.isDown) {
		motorSpeed = 0;
	} // prioritize braking
	else if (cursors.left.isDown && !cursors.right.isDown) {
		motorSpeed *= -1;
		turnSpeed *= -1;
		vehicleBody.speed
	} else if (cursors.right.isDown && !cursors.left.isDown) {} else {
		motorEnabled = false;
	} // roll if no keys pressed

	for (var i = 0; i < cCar.carNumWheels; i++) {
		driveJoints[i].EnableMotor(motorEnabled);
		flipr2.EnableMotor(motorEnabled);
		driveJoints[i].SetMotorSpeed(motorSpeed * cCarWheel[i].active);
		flipr2.SetMotorSpeed(turnSpeed * -1)
	}
}

function render() {

	game.debug.box2dWorld();

}
