var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
    create: create,
    update: update,
    render: render
});

var car = [golfCart, truck, apc, foodCart, atv, tank, nascar]; //Load all the cars
var selection = 4;
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

    game.world.setBounds(-10000, -10000, 20000, 20000);

    game.stage.backgroundColor = '#203050';

    // Enable Box2D physics
    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.gravity.y = 250;
    game.physics.box2d.friction = 0.75;

    // Make the ground body
    var groundBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
    groundBody.setChain(groundVertices[sSelection].data);


    var jointAnchor = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0); //car limit physics
    jointAnchor.setPolygon[10, 10, 10, -10, -10, -10, -10, 10];

    var PTM = 50 * cCar.carPTM;

    // Make the car body
    vehicleVertices = cCar.carVertices;
    vehicleBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, -1 * PTM);
    vehicleBody.setPolygon(vehicleVertices);
    // bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
    flipr = game.physics.box2d.motorJoint(jointAnchor, vehicleBody, 0.005, 0.05, 0);
    // Make the wheel bodies



    var wheelBodies = [];
    for (var i = 0; i < cCar.carNumWheels; i++) {
        wheelBodies[i] = new Phaser.Physics.Box2D.Body(this.game, null, cCarWheel[i].xPos * PTM, 0.6 * -PTM, 2);
        wheelBodies[i].setCircle(0.3 * PTM + cCarWheel[i].size);
        //wheelBodies[i].friction(cCarWheel[i].grip);

    }


    var motorTorque = cCar.carPower;
    var rideHeight = cCar.height;

    // Make wheel joints
    // bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled	
    for (var i = 0; i < cCar.carNumWheels; i++) {
        driveJoints[i] = game.physics.box2d.wheelJoint(vehicleBody, wheelBodies[i], cCarWheel[i].xPos * PTM, rideHeight * PTM, 0, 0, 0, 1, cCarWheel[i].springs, cCarWheel[i].damping, 0, motorTorque * cCarWheel[i].active, true);
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

    for (var i = 0; i < cCar.carNumWheels; i++) {
        driveJoints[i].EnableMotor(motorEnabled);
        driveJoints[i].SetMotorSpeed(motorSpeed);
    }
}

function render() {

    game.debug.box2dWorld();

}
