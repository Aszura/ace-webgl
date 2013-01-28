function LodGroup(mLoader){
	GameObject.call(this, mLoader);
	this.meshes = [];
	this.distances = [];
	this.activeMesh = 0;
}

LodGroup.prototype = Object.create(GameObject.prototype, {
	AddLodMesh: {
		value: function(meshName, lodDistanceAdditive){
			if(this.meshes.length == 0){
				this.SetMesh(meshName);
			}
			this.meshes.push(meshName);
			this.distances.push(lodDistanceAdditive);
		}
	},
	Draw:{
		value: function(shaderProgram, camera){
			var distance = vec3.distance(camera.position, this.position);
			for(var i = 0; i < this.meshes.length; i++){
				if(distance <= this.distances[i] || this.meshes.length-1 == i){
					//set model and normal matrices
					gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, this.mMatrix);
					var normalMatrix = mat4.create();
					mat4.multiply(normalMatrix, camera.vMatrix, this.mMatrix);
					mat4.invert(normalMatrix, normalMatrix);
					mat4.transpose(normalMatrix, normalMatrix);
					gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, normalMatrix);
					this.activeMesh = i;
					this.meshLoader.meshes[this.meshes[i]].Draw(shaderProgram, camera);
					return;
				}
				
			}
		}
	}
});