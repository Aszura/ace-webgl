function Input(playerCamera){
	var thisObj = this;
	this.playerCamera = playerCamera;
	this.keysPressed = [];
	this.movementSpeed = 0.005;
	for(var i = 0; i < 223; i++){
		this.keysPressed.push(false);
	}
	document.addEventListener("keydown", function(e){
		thisObj.keysPressed[e.keyCode] = true;
	}, false);
	
	document.addEventListener("keyup", function(e){
		thisObj.keysPressed[e.keyCode] = false;
	}, false);
	
	this.update = function(elapsed){
		// Move forward
		if (this.keysPressed[enums.keyboard.KEY_W]){
			var moveVec = vec3.create();
			vec3.scale(moveVec, playerCamera.direction, elapsed * this.movementSpeed);
			vec3.add(playerCamera.position, playerCamera.position, moveVec);
		}
		// Move backward
		if (this.keysPressed[enums.keyboard.KEY_S]){
			var moveVec = vec3.create();
			vec3.scale(moveVec, playerCamera.direction, elapsed * this.movementSpeed);
			vec3.subtract(playerCamera.position, playerCamera.position, moveVec);
		}
		// Strafe right
		if (this.keysPressed[enums.keyboard.KEY_D]){
			var moveVec = vec3.create();
			vec3.scale(moveVec, playerCamera.right, elapsed * this.movementSpeed);
			vec3.add(playerCamera.position, playerCamera.position, moveVec);
		}
		// Strafe left
		if (this.keysPressed[enums.keyboard.KEY_A]){
			var moveVec = vec3.create();
			vec3.scale(moveVec, playerCamera.right, elapsed * this.movementSpeed);
			vec3.subtract(playerCamera.position, playerCamera.position, moveVec);
		}
	};
}