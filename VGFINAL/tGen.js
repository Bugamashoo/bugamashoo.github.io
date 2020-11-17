function continuousTerrainGen2() {

	if (((((Math.floor((com.x) / 2000))) + 0.9) % 2) < 1 && ((((Math.floor((com.x) / 2000))) + 0.9) % 2) >= 0.75 && (tempv < (((Math.floor((com.x) / 2000))) + 0.9))) {
		if (sectOne == true && sectTwo == false) {
			moreGroundOne.destroy();
			groundGen = [];
			i--;
			for (var i2 = 0; i2 < 101; i2++) {
				groundGen.push(((i + 1) * 20));
				groundGen.push((-1 * Math.abs((((i + 1) * 20) / ((7 * ((i + 1) * 20)) + (((i + 1) * 20) ^ 3))) + (((i + 1) * 20) / 7) + ((52.35 * groundVertices[sSelection].s1) + (0.001 * ((i + 1) * 20))) * Math.sin(((1.417 / 291) * ((i + 1) * 20)) + (0.0206868 * Math.sin(((i + 1) * 20) / 3))) + ((21 * groundVertices[sSelection].s2) * Math.sin((((i + 1) * 20) / 47.74) + (1 / 6.3))) + ((4.57 * groundVertices[sSelection].s3) * Math.sin(((i + 1) * 20) / (9.4 - (9.4 * 2)))) * (-1))));
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
			tempv = (((Math.floor((com.x) / 2000))) + 0.25);
			yPlaceholder = yPlaceholder + (groundGen[groundGen.length - 1]);

		}
	} else if (((((Math.floor((com.x) / 2000))) + 0.9) % 2) < 2 && ((((Math.floor((com.x) / 2000))) + 0.9) % 2) >= 1.75 && (tempv < (((Math.floor((com.x) / 2000))) + 0.9))) {
		if (sectOne == false && sectTwo == true) {
			moreGroundTwo.destroy();
			//moreGroundTwo.setChain([0, 100, 5, 100]);
			groundGen = [];
			i--;
			for (var i2 = 0; i2 < 101; i2++) {
				groundGen.push(((i + 1) * 20));
				groundGen.push((-1 * Math.abs((((i + 1) * 20) / ((7 * ((i + 1) * 20)) + (((i + 1) * 20) ^ 3))) + (((i + 1) * 20) / 7) + ((52.35 * gStats.s1) + (0.001 * ((i + 1) * 20))) * Math.sin(((1.417 / 291) * ((i + 1) * 20)) + (0.0206868 * Math.sin(((i + 1) * 20) / 3))) + ((21 * gStats.s2) * Math.sin((((i + 1) * 20) / 47.74) + (1 / 6.3))) + ((4.57 * gStats.s3) * Math.sin(((i + 1) * 20) / (9.4 - (9.4 * 2)))) * (-1))));
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
			tempv = (((Math.floor((com.x) / 2000))) + 0.25);
			yPlaceholder = yPlaceholder + (groundGen[groundGen.length - 1]);
		}
	}
}

function vp2(check) {
	return (check * ((vCC.carPower * vCC.carMaxSpeed) - (vCC.airResist + vCC.downforce + vCM) + (vCC.agility + vCC.rotateSpeed + (vCC.gas * vCC.carNumWheels))));
}
