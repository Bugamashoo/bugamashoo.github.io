
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render, update: update });

//Vertices to create chainShape that forms the inner wall of the entire racetrack
var trackInnerVertices = [230,120, 150,200, 150,250, 250,250, 550,250, 600,300, 600,400, 550,450, 150,450, 150,490, 620,490, 670,440, 670,170, 620,120, 230,120];

//Vertices to create chainSHape that forms the outer wall of the entire racetrack
var trackOuterVertices = [200,20, 50,150, 50,300, 100,350, 500,350, 500,360, 100,360, 50,400, 50,540, 100,590, 720,590, 770,540, 770,70, 720,20, 200,20];
function preload() {
    game.load.image('car', 'assets/sprites/car.png');
    game.load.image('racetrack', 'assets/sprites/racetrack.png');
    game.load.image('platform', 'assets/sprites/platform.png');
}


var cursors; //arrow keys to control car
var car; //variable to hold car sprite
var lastLapTime = 0; //keep track of lap time
var lapTime = 0; //keep track of lap time
var lapText; //display last lap time
var turbo = false; //keep track of whether turbo is active
var turboTime = 0; //keep track of when turbo becomes available/runs out
var turboText; //display when turbo is available
var bestLapTime = 0; //keep track of best lap time
var bestLapText; //display best lap time

function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
    
    game.physics.box2d.setBoundsToWorld();
    game.physics.box2d.restitution = 0.5;
    game.physics.box2d.friction = 2;
    
    //set up cursors for arrow key input
    cursors = game.input.keyboard.createCursorKeys();
    
    //create track
    game.add.sprite(0, 0, 'racetrack');
    //Create track
    var innerTrack = new Phaser.Physics.Box2D.Body(game, null, 0, 0, 0);
    innerTrack.setChain(trackInnerVertices);
    
    var outerTrack = new Phaser.Physics.Box2D.Body(game, null, 0, 0, 0);
    outerTrack.setChain(trackOuterVertices);
    //Create car
    car = game.add.sprite(730, game.world.centerY, 'car');
    game.physics.box2d.enable(car);
    createCar(car);
    
    //platform to be used for finish line
    var plat = game.add.sprite(400, -20, 'platform');
    game.physics.box2d.enable(plat);
    plat.body.static = true;
    
    //fixture added to platform for finish line, to access Fixture.SetSensor method
    var finish = plat.body.addRectangle(20, 100, 0, 90, 0);
    finish.SetSensor(true);
    
    //set contact callback between car and finish line so that crossFinishLine() is called every time a lap is completed
    car.body.setFixtureContactCallback(finish, crossFinishLine, this);
    
    
    //set up text fields with default text values
    lapText = game.add.text(5, 10, 'Last Lap Time: --', { fill: '#ffffff', font: '12pt Arial' });
    bestLapText = game.add.text(5, 30, 'Best Lap Time: --', { fill: '#ffffff', font: '12pt Arial' });
    turboText = game.add.text(5, 50, 'Hit Z for Turbo Boost!', { fill: '#dddddd', font: '12pt Arial' });
    

}

//car/finish line contact callback. Called at the completion of each lap
function crossFinishLine(carBody, lineBody, carFixture, lineFixture, begin, contact) {
    //make sure it is a begin event so it is only called once each time the finish line is crossed
    if (begin) {
        if (lastLapTime != 0) { // if lastLapTime is not 0(if this isn't the first time crossing the finish line)
            //calculate lap time
            lapTime = game.time.now - lastLapTime; 
            //reset lastLapTime to the current time so it can be used to calculate the time of the next lap
            lastLapTime = game.time.now;
            //set lastLap text to the time of the last lap in seconds
            lapText.text = 'Last Lap Time: ' + (lapTime / Phaser.Timer.SECOND);
            //if bestLapTime hasn't been set yet, or if this lap is faster than the bestLapTime, then set this laps time as the new bestLapTime
            if (bestLapTime == 0 || lapTime < bestLapTime) {
                bestLapTime = lapTime;
                bestLapText.text = 'Best Lap Time: ' + (bestLapTime / Phaser.Timer.SECOND);
            }
        } else { //if this is the first time crossing finish line
            lastLapTime = game.time.now; //set lastLapTime so that next time the finish line is crossed it can calculate the lapTime and everything else
        }
    }
}


function update() {
    //set zero rotation every frame, so that the car doesn't keep turning even when no keys are pressed
    car.body.setZeroRotation();
    
    //handle left/right turning
    if (cursors.left.isDown)
    {
        car.turnLeft();	
    }
    else if (cursors.right.isDown)
    {
        car.turnRight();
    }

    //accelerate when up is pressed
    if (cursors.up.isDown) 
    {
        car.accelerate();
    }
    else if (cursors.down.isDown)
    {
        //breaks unnecesary :). 
    }
    
    //Handle turbo
    if (!turbo) {  //if turbo isn't currently active
        if (game.input.keyboard.isDown(Phaser.Keyboard.Z)) //if Z(turbo key) is being pressed
        {
            if (game.time.now > turboTime) { //the current time is passed the turbo cooldown
                //activate turbo, set the turboTime to a second from now so that once a second passes the update loop will turn of the turbo
                turboTime = game.time.now + Phaser.Timer.SECOND;
                turbo = true;
                car.power = 800;
            }
        } 
        if (game.time.now > turboTime) {//whether or not z is pressed, check if current time is passed turbo time
            //if it is set the turboText telling the user to activate turbo boost
            turboText.text = 'Hit Z for Turbo Boost!';
        } else { // if it's not ready yet tell the user how long until they can use turbo
            turboText.text = 'Turbo in - ' + ((turboTime - game.time.now) / Phaser.Timer.SECOND);
        }
    } else { //if turbo is currently active
        if (game.time.now > turboTime) { //if current time i passed turbo time then deactivate turbo
            turboTime = game.time.now + Phaser.Timer.SECOND * 5;
            turbo = false;
            car.power = 450;
        }
    }

}

function render() {
	
	//game.debug.box2dWorld();
	
}

//Create car. Takes a simple car sprite and adds all the properties and functions needed to make it a functional top-down vehicle
function createCar(sprite) { 
    //set the body to a slightly smaller rectangle, so there is no padding around the outside of the sprite that cause you to hit walls even when visually the car sprite isn't touching the wall
    sprite.body.setRectangle(18, 28, 0, 0, 0);
    
    //movement variables. power for speed/acceleration, turnspeed for handling, and damping to decrease sliding/driftyness
    sprite.body.linearDamping = 1.6;
    sprite.power = 450;
    sprite.turnSpeed = 140;
    
    
    //accelerate function
    sprite.accelerate = function() {
        sprite.body.thrust(sprite.power);
    }
    
    
    //left and right turning functions
    sprite.turnLeft = function() {
        sprite.body.rotateLeft(sprite.turnSpeed);
    }
    
    sprite.turnRight = function() {
        sprite.body.rotateRight(sprite.turnSpeed);
    }
        
}
    
    


