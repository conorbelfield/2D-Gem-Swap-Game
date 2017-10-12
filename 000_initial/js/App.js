// App constructor
let App = function(canvas, overlay) {
	this.canvas = canvas;
	this.overlay = overlay;

	// if no GL support, cry
	this.gl = canvas.getContext("experimental-webgl");
	if (this.gl === null) {
		throw new Error("Browser does not support WebGL");

	}

	this.keysPressed = { };
	this.gl.pendingResources = {};
	// create a simple scene
	this.scene = new Scene(this.gl);
	this.timeAtLastFrame = new Date().getTime(); // ADDED get the time 
	this.resize();
	this.xCord = {};
	this.yCord = {};

};

// match WebGL rendering resolution and viewport to the canvas size
App.prototype.resize = function() {
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
	this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
	this.scene.camera.setAspectRatio(		
    	this.canvas.clientWidth /		
    	this.canvas.clientHeight );
};



App.prototype.registerEventHandlers = function() {
	let theApp = this;
	let chosenX, chosenY = null;
	let isClicked = false;
	let originalX = null;

	document.onkeydown = function(event) {
		//jshint unused:false
		theApp.keysPressed[keyboardMap[event.keyCode]] = true;
		
	};
	document.onkeyup = function(event) {
		//jshint unused:false
		theApp.keysPressed[keyboardMap[event.keyCode]] = false;


	};
	this.canvas.onmousedown = function(event) {
		//jshint unused:false
		isClicked = true;
		var coords = new Vec4(((event.clientX / theApp.canvas.clientWidth) - .5)*2,
		 (((event.clientY/ theApp.canvas.clientHeight) - .5) * -2), 1, 0);


		var matrixTemp = new Mat4();
		 matrixTemp.set(theApp.scene.camera.viewProjMatrix);
		 matrixTemp.invert();
		 coords.mul(matrixTemp);
		 //convert this location to an object
		 theApp.xCord = Math.floor((coords.x + 1) / .2);
		 theApp.yCord = Math.floor((coords.y + 1) / .2);

		 originalX = (theApp.xCord -5)/5;
		 originalY = (theApp.yCord -5)/5;

		 if (theApp.keysPressed["B"]) {
		 	theApp.scene.grid[theApp.xCord][theApp.yCord].removing = true;
		 }



	};
	this.canvas.onmousemove = function(event) {
		//jshint unused:false
		if (isClicked) {
			var coords = new Vec4(((event.clientX / theApp.canvas.clientWidth) - .5)*2,
		 		(((event.clientY/ theApp.canvas.clientHeight) - .5) * -2), 0, 1);

			var matrixTemp = new Mat4();
		 matrixTemp.set(theApp.scene.camera.viewProjMatrix);
		 matrixTemp.invert();
		 coords.mul(matrixTemp);
			
			theApp.scene.grid[theApp.xCord][theApp.yCord].position.storage[0] = coords.x;
			theApp.scene.grid[theApp.xCord][theApp.yCord].position.storage[1] = coords.y
			
			
		}
		event.stopPropagation();
		
	};
	this.canvas.onmouseout = function(event) {
		
		//jshint unused:false
		theApp.scene.grid[theApp.xCord][theApp.yCord].position.storage[0] = originalX;
		theApp.scene.grid[theApp.xCord][theApp.yCord].position.storage[1] = originalY;
		

		isClicked = false;
	};
	this.canvas.onmouseup = function(event) {
		//jshint unused:false
		var coords = new Vec4(((event.clientX / theApp.canvas.clientWidth) - .5) * 2,
		 (((event.clientY/ theApp.canvas.clientHeight) - .5) * -2), 1, 0);

		 
		 var matrixTemp = new Mat4();
		 matrixTemp.set(theApp.scene.camera.viewProjMatrix);
		 matrixTemp.invert();

		 coords.mul(matrixTemp);
		 //coords.mul(theApp.scene.camera.viewProjMatrix.invert());
		 //theApp.scene.camera.viewProjMatrix.invert();

		 var xCord2 = Math.floor((coords.x + 1) / .2);
		 var yCord2 = Math.floor((coords.y + 1) / .2);
		 //Make current square selected
		//console.log(xCord2,yCord2);

			// if valid()
		
		if (moveIfValid(theApp,theApp.xCord,theApp.yCord,xCord2,yCord2)) {
			

			//theApp.scene.grid[theApp.xCord][theApp.yCord].position.storage[0] = ;
			//theApp.scene.grid[theApp.xCord][theApp.yCord].position.storage[1] = ;
		}
		
		theApp.scene.grid[theApp.xCord][theApp.yCord].position.storage[0] = originalX;
		theApp.scene.grid[theApp.xCord][theApp.yCord].position.storage[1] = originalY;
		

		isClicked = false;

	};
	window.addEventListener('resize', function() {
		theApp.resize();
	});
	window.requestAnimationFrame(function() {
		theApp.update();
	});
};

function moveIfValid(theApp, i, j, i2, j2) {

	if (i == i2 && j == j2)
		return false;
	if (Math.abs(i - i2) >1 || Math.abs(j-j2) > 1 || (Math.abs(i - i2) == 1 && Math.abs(j-j2) == 1))
		return false;
	
	var temp = theApp.scene.grid[i][j];
	temp.position.storage[0] = (i2-5)/5;
	temp.position.storage[1] = (j2-5)/5;
	theApp.scene.grid[i][j] = theApp.scene.grid[i2][j2];
	theApp.scene.grid[i2][j2] = temp;

	for (var a = -2; a < 1; a++) {
		if (i + a >= 0 && i + a <= 7) {
			if (theApp.scene.grid[i+a][j].id === theApp.scene.grid[i+a+1][j].id 
				&& theApp.scene.grid[i+a+2][j].id === theApp.scene.grid[i+a][j].id) {

				
				return true;
			}
		}
		if (i2 + a >= 0 && i2 + a <= 7) {
			if (theApp.scene.grid[i2+a][j2].id === theApp.scene.grid[i2+a+1][j2].id 
				&& theApp.scene.grid[i2+a+2][j2].id === theApp.scene.grid[i2+a][j2].id)
				return true;
		}
		if (j + a >= 0 && j + a <= 7) {
			if (theApp.scene.grid[i][j+a].id === theApp.scene.grid[i][j+a+1].id 
			&& theApp.scene.grid[i][j+a+2].id === theApp.scene.grid[i][j+a].id)
				return true;
		}
		if (j2 + a >= 0 && j2 + a <= 7) {
			if (theApp.scene.grid[i2][j2+a].id === theApp.scene.grid[i2][j2+a+1].id 
			&& theApp.scene.grid[i2][j2+a+2].id === theApp.scene.grid[i2][j2+a].id)
				return true;
		}
	}
	
	// If we reach here, ther was no valid move
	temp = theApp.scene.grid[i][j];
	theApp.scene.grid[i][j] = theApp.scene.grid[i2][j2];
	theApp.scene.grid[i2][j2] = temp;

	return false;
}



// animation frame update
App.prototype.update = function() {

	let pendingResourceNames = Object.keys(this.gl.pendingResources);
	if (pendingResourceNames.length === 0) {
		// animate and draw scene
		this.scene.update(this.gl, this.keysPressed);
		this.overlay.innerHTML = "Ready.";
	} else {
		this.overlay.innerHTML = "Loading: " + pendingResourceNames;
	}

	// refresh
	let theApp = this;
	window.requestAnimationFrame(function() {
		theApp.update();
	});
};

// entry point from HTML
window.addEventListener('load', function() {
	let canvas = document.getElementById("canvas");
	let overlay = document.getElementById("overlay");
	overlay.innerHTML = "WebGL";

	let app = new App(canvas, overlay);
	app.registerEventHandlers();
});