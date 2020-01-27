var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, render: render });

function create() {
    
    game.stage.backgroundColor = '#124184';

    game.physics.startSystem(Phaser.Physics.BOX2D);
    game.physics.box2d.gravity.y = 500;
    game.physics.box2d.restitution = 0.5;
    game.physics.box2d.setBoundsToWorld();

    for (var i = 0; i < 10; i++)
    {
        var ball = new Phaser.Physics.Box2D.Body(this.game, null, game.world.centerX, 400 - (i * 48));
        ball.setCircle(16);
        ball.bullet = true;
    }

    game.input.onDown.add(mouseDragStart, this);
    game.input.addMoveCallback(mouseDragMove, this);
    game.input.onUp.add(mouseDragEnd, this);

}

function mouseDragStart() {
    
    game.physics.box2d.mouseDragStart(game.input.mousePointer);
    
}

function mouseDragMove() {
    
    game.physics.box2d.mouseDragMove(game.input.mousePointer);
    
}

function mouseDragEnd() {
    
    game.physics.box2d.mouseDragEnd();
    
}

function render() {

    game.debug.box2dWorld();

}
