function continuousTerrainGen2() {
	// cache these - they were each computed 3-4 times per call
	var floorChunk = (Math.floor(com.x / 2000)) + 0.9;
	var modChunk = floorChunk % 2;

	if (modChunk < 1 && modChunk >= 0.75 && tempv < floorChunk) {
		if (sectOne == true && sectTwo == false) {
			moreGroundOne.destroy();
			groundGen = [];
			i--;
			for (var i2 = 0; i2 < 101; i2++) {
				var xv = (i + 1) * 20; // was computed 9 times per iteration
				groundGen.push(xv);
				groundGen.push((-1 * Math.abs((xv / ((7 * xv) + (xv ^ 3))) + (xv / 7) + ((52.35 * groundVertices[sSelection].s1) + (0.001 * xv)) * Math.sin(((1.417 / 291) * xv) + (0.0206868 * Math.sin(xv / 3))) + ((21 * groundVertices[sSelection].s2) * Math.sin((xv / 47.74) + (1 / 6.3))) + ((4.57 * groundVertices[sSelection].s3) * Math.sin(xv / -9.4)) * (-1))));
				gStats.s3 = gStats.s3 + gStats.sss3;
				gStats.s2 = gStats.s2 + gStats.sss2;
				gStats.s1 = gStats.s1 + (gStats.sss1 * gStats.ssss1);
				gStats.ssss1 = gStats.ssss1 / 1.01;
				i++;
			}
			moreGroundOne = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
			moreGroundOne.x = 618; //groundGen[groundGen.length - 1] + 700;
			moreGroundOne.y = -15; //yPlaceholder;
			moreGroundOne.setChain(groundGen);
			moreGroundOne.autoCull = true;
			moreGroundOne.restitution = (0 + gStats.boing);
			sectOne = false;
			sectTwo = true;
			chunkNum = chunkNum + 1;
			tempv = (Math.floor(com.x / 2000)) + 0.25;
			yPlaceholder = yPlaceholder + (groundGen[groundGen.length - 1]);

		}
	} else if (modChunk < 2 && modChunk >= 1.75 && tempv < floorChunk) {
		if (sectOne == false && sectTwo == true) {
			moreGroundTwo.destroy();
			//moreGroundTwo.setChain([0, 100, 5, 100]);
			groundGen = [];
			i--;
			for (var i2 = 0; i2 < 101; i2++) {
				var xv = (i + 1) * 20; // was computed 9 times per iteration
				groundGen.push(xv);
				groundGen.push((-1 * Math.abs((xv / ((7 * xv) + (xv ^ 3))) + (xv / 7) + ((52.35 * gStats.s1) + (0.001 * xv)) * Math.sin(((1.417 / 291) * xv) + (0.0206868 * Math.sin(xv / 3))) + ((21 * gStats.s2) * Math.sin((xv / 47.74) + (1 / 6.3))) + ((4.57 * gStats.s3) * Math.sin(xv / -9.4)) * (-1))));
				gStats.s3 = gStats.s3 + gStats.sss3;
				gStats.s2 = gStats.s2 + gStats.sss2;
				gStats.s1 = gStats.s1 + (gStats.sss1 * gStats.ssss1);
				gStats.ssss1 = gStats.ssss1 / 1.01;
				i++;
			}
			moreGroundTwo = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
			moreGroundTwo.x = 618; //groundGen[groundGen.length - 2] + 700;
			moreGroundTwo.y = -15; //yPlaceholder;
			moreGroundTwo.setChain(groundGen);
			moreGroundTwo.autoCull = true;
			moreGroundTwo.restitution = (0 + gStats.boing);
			sectOne = true;
			sectTwo = false;
			chunkNum++;
			tempv = (Math.floor(com.x / 2000)) + 0.25;
			yPlaceholder = yPlaceholder + (groundGen[groundGen.length - 1]);
		}
	}
}

function vp2(check) {
	var vCC = cCar;
	var vCM = vCC.carMass + vCC.carMassX + vCC.carMassY;
	return (check * ((vCC.carPower * vCC.carMaxSpeed) - (vCC.airResist + vCC.downforce + vCM) + (vCC.agility + vCC.rotateSpeed + (vCC.gas * vCC.carNumWheels))));
}
