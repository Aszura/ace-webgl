function GameObject(mLoader, context){
	this.meshLoader = mLoader;
	this.mMatrix = mat4.create();
	this.position = vec3.create();
	this.mesh = "";
	this.transparent = false;
	this.alpha = 1.0;
}

GameObject.prototype = {
	SetMesh: function(meshName){
		this.mesh = meshName;
		if(this.meshLoader.meshes[meshName] === undefined){
			alert(meshName);
		}
		mat4.copy(this.mMatrix, this.meshLoader.meshes[meshName].mMatrix);
		vec3.copy(this.position, this.meshLoader.meshes[meshName].position);
		this.transparent = this.meshLoader.meshes[meshName].transparent;
		this.alpha = this.meshLoader.meshes[meshName].alpha;
	},
	Translate: function(vec){
		mat4.translate(this.mMatrix, this.mMatrix, vec);
		vec3.add(this.position, this.position, vec);
	},	
	Rotate: function(rad, vec){
		mat4.rotate(this.mMatrix, this.mMatrix, rad, vec);
	},	
	Scale: function(vec){
		mat4.scale(this.mMatrix, this.mMatrix, scale);
	},	
	GetPosition: function(out){
		vec3.copy(out, this.position);
	},
	Draw: function(shaderProgram, camera){
		//set model and normal matrices
		gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, this.mMatrix);
		var normalMatrix = mat4.create();
		mat4.multiply(normalMatrix, camera.vMatrix, this.mMatrix);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);
		gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, normalMatrix);
		this.meshLoader.meshes[this.mesh].Draw(shaderProgram, camera);
	}
}