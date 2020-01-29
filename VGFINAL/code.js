var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
    create: create,
    update: update,
    render: render
});

var car = [golfCart, truck, apc]; //Load all the cars

var vehicleVertices = [];
var selection = 2; //Car selection
var sSelection = 0; //Stage selection
var groundVertices;
var updat = 2;

//upgrades
var susUp;
var tirUp;

var cCar = car[selection]; //get body collision data for selected car
var cCarWheel = car[selection].carWheel; //get body collision data for selected car 
var driveJoints = [];

function create() {

    game.world.setBounds(-10000, -10000, 20000, 20000);

    game.stage.backgroundColor = '#203050';

    // Enable Box2D physics
    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.gravity.y = 250;
    game.physics.box2d.friction = 0.75;

    // Make the ground body
    var groundBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
    groundBody.setChain(groundVertices[sSelection].data);

    var PTM = 50 * cCar.carPTM;

    // Make the car body
    vehicleVertices = cCar.carVertices;
    vehicleBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, -1 * PTM);
    vehicleBody.setPolygon(vehicleVertices);

    // Make the wheel bodies



    var wheelBodies = [];
    wheelBodies[0] = new Phaser.Physics.Box2D.Body(this.game, null, cCarWheel[0].xPos * PTM, 0.6 * -PTM);
    wheelBodies[0].setCircle(0.3 * PTM);
    wheelBodies[1] = new Phaser.Physics.Box2D.Body(this.game, null, cCarWheel[1].xPos * PTM, 0.6 * -PTM);
    wheelBodies[1].setCircle(0.3 * PTM);
    //wheelBodies[1].setAttribute.friction(0.95);
    if (cCar.carNumWheels == 3) {
        wheelBodies[2] = new Phaser.Physics.Box2D.Body(this.game, null, cCarWheel[2].xPos * PTM, 0.6 * -PTM);
        wheelBodies[2].setCircle(0.3 * PTM);
        //wheelBodies[2].setAttribute.friction(0.95);
    }


    var motorTorque = cCar.carPower;
    var rideHeight = cCar.height;

    // Make wheel joints
    // bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled	
    driveJoints[0] = game.physics.box2d.wheelJoint(vehicleBody, wheelBodies[0], cCarWheel[0].xPos * PTM, rideHeight * PTM, 0, 0, 0, 1, cCarWheel[0].springs, cCarWheel[0].damping, 0, motorTorque * cCarWheel[0].active, true); // rear
    driveJoints[1] = game.physics.box2d.wheelJoint(vehicleBody, wheelBodies[1], cCarWheel[1].xPos * PTM, rideHeight * PTM, 0, 0, 0, 1, cCarWheel[1].springs, cCarWheel[1].damping, 0, motorTorque * cCarWheel[1].active, true); // front
    updat = 2;
    if (cCar.carNumWheels == 3) {
        driveJoints[2] = game.physics.box2d.wheelJoint(vehicleBody, wheelBodies[2], cCarWheel[2].xPos * PTM, rideHeight * PTM, 0, 0, 0, 1, cCarWheel[2].springs, cCarWheel[2].damping, 0, motorTorque * cCarWheel[2].active, true); // front
        updat = 3;
    }

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(vehicleBody);
    var caption = game.add.text(5, 5, 'Left/right arrow keys to move, down arrow key to brake.', {
        fill: '#ffffff',
        font: '14pt Arial'
    });
    caption.fixedToCamera = true;
}

function update() {

    var motorSpeed = 50; // rad/s
    var motorEnabled = true;

    if (cursors.down.isDown) {
        motorSpeed = 0;
    } // prioritize braking
    else if (cursors.left.isDown && !cursors.right.isDown) {
        motorSpeed *= -1;
    } else if (cursors.right.isDown && !cursors.left.isDown) {} else {
        motorEnabled = false;
    } // roll if no keys pressed

    for (var i = 0; i < updat; i++) {
        driveJoints[i].EnableMotor(motorEnabled);
        driveJoints[i].SetMotorSpeed(motorSpeed);
    }
}

function render() {

    game.debug.box2dWorld();

}
