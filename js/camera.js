function Camera(){
	// position
	this.position = vec3.fromValues(0.0, 0.0, 0.0);
	this.direction = vec3.create();
	this.up = vec3.fromValues(0.0, 1.0, 0.0);
	this.right = vec3.fromValues(1.0, 0.0, 0.0);
	// Initial Field of View
	this.initialFoV = 45.0;
	
	this.verticalInvert = false;
	this.vMatrix = mat4.create();
	this.speed = 3.0; // 3 units / second
	this.mouseSpeed = 0.0005;
	
	// horizontal angle : toward -Z
	var horizontalAngle = 3.14;
	// vertical angle : 0, look at the horizon
	var verticalAngle = 0.0;
	// mouse movement
	var movementX = 0, movementY = 0;
	
	document.addEventListener("mousemove", function(e) {
		movementX = e.movementX       ||
			e.mozMovementX    ||
			e.webkitMovementX ||
			0;
		movementY = e.movementY       ||
			e.mozMovementY    ||
			e.webkitMovementY ||
			0;

		// Print the mouse movement delta values
		//console.log("movementX=" + movementX, "movementY=" + movementY);
	}, false);
	
	this.update = function(elapsed){
		// Compute new orientation
		horizontalAngle -= this.mouseSpeed * elapsed * movementX;
		if(!this.verticalInvert){
			verticalAngle   -= this.mouseSpeed * elapsed * movementY;
		}else{
			verticalAngle += this.mouseSpeed * elapsed * movementY;
		}
		movementX = 0;
		movementY = 0;
		
		if(verticalAngle > 1.5)
		{
			verticalAngle = 1.5;
		}
		if(verticalAngle < -1.5)
		{
			verticalAngle = -1.5;
		}

		// Direction : Spherical coordinates to Cartesian coordinates conversion
		vec3.set(
			this.direction,
			Math.cos(verticalAngle) * Math.sin(horizontalAngle),
			Math.sin(verticalAngle),
			Math.cos(verticalAngle) * Math.cos(horizontalAngle)
		);
		
		// Right vector
		vec3.set(
			this.right,
			Math.sin(horizontalAngle - 3.14/2.0),
			0,
			Math.cos(horizontalAngle - 3.14/2.0)
		);
		
		// Up vector : perpendicular to both direction and right
		vec3.cross( this.up, this.right, this.direction );
		
		// Calculate center
		var center = vec3.create();
		vec3.add(center, this.position,this.direction);
		
		// Calculate ViewMatrix
		mat4.lookAt(
			this.vMatrix, 
			this.position, 
			center,
			this.up
		);
	};
	

}