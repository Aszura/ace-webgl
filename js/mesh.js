function Mesh(context){
	this.vertices = new Array();
	this.normals = new Array();
	this.faces = new Array();
	this.uvs = new Array();
	this.vboOffset = 0;
	this.iboOffset = 0;
	
	var gl = context;
	
	this.Load = function(filename, callback){
		var thisObj = this;
		$.getJSON(filename, function(json){
			thisObj.vertices = json.vertices;
			thisObj.normals = json.normals;
			for(key in json.faces){
				if(key % 11 != 0 && key % 4 != 0){
					thisObj.faces.push(json.faces[key]);
				}
			}
			thisObj.uvs = json.uvs;
			callback();
		});
	};
	
	this.Draw = function(shaderProgram){
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		gl.enableVertexAttribArray(1);
		gl.enableVertexAttribArray(2);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, this.vboOffset*4);
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, this.vboOffset*4+this.vertices.length*4);
		gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, this.vboOffset*4+this.vertices.length*4+this.normals.length*4);
		gl.drawElements(gl.TRIANGLES, this.faces.length, gl.UNSIGNED_SHORT, this.iboOffset*2);
		//gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/3);
	};
}