function MeshLoader(context){
	this.meshes = {};
	var gl = context;
	var vbo = gl.createBuffer();
	var ibo = gl.createBuffer();
	var vboSize = 0;
	var iboSize = 0;
	
	var thisObj = this;
	
	this.LoadScene = function(filename, callback){
		$.getJSON(filename, function(json){
			var i = 0;
			for(key in json.objects){
				var objectName = filename.slice(0,-2);
				var position = vec3.fromValues(json.objects[key].position[0],json.objects[key].position[1],json.objects[key].position[2]);
				var quatRotation = quat.fromValues(json.objects[key].quaternion[0], json.objects[key].quaternion[1], json.objects[key].quaternion[2], json.objects[key].quaternion[3]);
				var scale = vec3.fromValues(json.objects[key].scale[0], json.objects[key].scale[1], json.objects[key].scale[2]);
				thisObj.LoadMesh(key, objectName + key + ".js", position, quatRotation, scale, function(){
					i++;
					if(i == json.metadata.objects){
						callback();
					}					
				});
			}
		});
	};
	
	this.LoadMesh = function(name, filename, position, quatRotation, scale, callback){
		var mesh = new Mesh(gl);
		mesh.Load(filename, position, quatRotation, scale,function(){
			thisObj.meshes[name] = mesh;
			mesh.vboOffset = vboSize;
			mesh.iboOffset = iboSize;
			vboSize += mesh.vertices.length;
			vboSize += mesh.normals.length;
			vboSize += mesh.uvs[0].length;
			iboSize += mesh.faces.length;
			callback();
		});
	};
	
	this.BindToBuffers = function(){
		var offset = 0;
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, vboSize * 4, gl.STATIC_DRAW);
		for(var key in this.meshes){
			gl.bufferSubData(gl.ARRAY_BUFFER, offset * 4, new Float32Array(this.meshes[key].vertices));
			offset += this.meshes[key].vertices.length;
			gl.bufferSubData(gl.ARRAY_BUFFER, offset * 4, new Float32Array(this.meshes[key].normals));
			offset += this.meshes[key].normals.length;
			gl.bufferSubData(gl.ARRAY_BUFFER, offset * 4, new Float32Array(this.meshes[key].uvs[0]));
			offset += this.meshes[key].uvs[0].length;
		}

		offset = 0;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, iboSize * 2, gl.STATIC_DRAW);
		for(var key in this.meshes){
			gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset * 2, new Uint16Array(this.meshes[key].faces));
			offset += this.meshes[key].faces.length;
		}
	};
	
	this.Bind = function(){
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	};
}