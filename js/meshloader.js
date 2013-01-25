function MeshLoader(context){
	this.meshes = {};
	var gl = context;
	var vbo = gl.createBuffer();
	var ibo = gl.createBuffer();
	var vboSize = 0;
	var iboSize = 0;
	
	this.LoadMesh = function(name, filename, callback){
		var mesh = new Mesh(gl);
		var thisObj = this;
		mesh.Load(filename, function(){
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