function Mesh(context){
	this.vertices = [];
	this.normals = [];
	this.faces = [];
	this.colors = [];
	this.uvs = new Array();
	this.materialIndex;
	this.texture = null;
	this.vboOffset = 0;
	this.iboOffset = 0;
	var thisObj = this;
	var gl = context;
	var mMatrix = mat4.create();
	
	this.Load = function(filename, position, quatRotation, scale, callback){
		$.getJSON(filename, function(json){
			mat4.fromRotationTranslation(mMatrix, quatRotation, position);
			mat4.scale(mMatrix, mMatrix, scale);
			parseModel(json, 1.0);
			//thisObj.uvs[0] = json.uvs[0];
			// for(var i = 0; i < json.vertices.length; i+=3){
				// thisObj.vertices.push(vec3.fromValues(json.vertices[i], json.vertices[i+1], json.vertices[i+2]));
			// }
			// for(var i = 0; i < json.normals.length; i+=3){
				// thisObj.normals.push(vec3.fromValues(json.normals[i], json.normals[i+1], json.normals[i+2]));
			// }
			// for(var i = 0; i < json.faces.length; i+=3){
				// thisObj.faces.push(vec3.fromValues(json.faces[i],json.faces[i+1],json.faces[i+2]));
			// }
			// thisObj.vertices = json.vertices;
			// thisObj.normals = json.normals;
			// for(var i = 0; i < json.faces.length; i++){
				// thisObj.faces.push(json.faces[i]);
			// }
			// for(var i = 0; i < json.uvs[0].length; i+=2)
			// {
				// thisObj.uvs.push(json.uvs[0][i]);
				// thisObj.uvs.push(json.uvs[0][i+1]);
				// thisObj.uvs.push(0);
				// //thisObj.uvs.push(vec3.fromValues(json.uvs[0][i], json.uvs[0][i+1],0));
			// }
			loadTexture(json.materials[thisObj.materialIndex].mapDiffuse, function(){
				callback();
			});
		});
	};
	
	this.Translate = function(vec){
		mat4.translate(mMatrix, mMatrix, vec);
	};
	
	this.Rotate = function(rad, vec){
		mat4.rotate(mMatrix, mMatrix, rad, vec);
	};
	
	this.Scale = function(vec){
		mat4.scale(mMatrix, mMatrix, scale);
	};
	
	function handleTextureLoaded(image, texture) {
		
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		
		//Anisotropic Filtering
		var ext = gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
		if(ext == null){
			ext = gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
		}
		if(ext != null){
			var max_anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
			gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max_anisotropy);
		}
		
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	
    function loadTexture(textureName, callback) {
        thisObj.texture = gl.createTexture();
        thisObj.texture.image = new Image();
        thisObj.texture.image.onload = function () {
            handleTextureLoaded(thisObj.texture.image, thisObj.texture);
			callback();
        };
		thisObj.texture.image.src = "models/" + textureName;
    }
	
	this.Draw = function(shaderProgram, camera){
		//bind textures
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		//set model and normal matrices
		gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
		var normalMatrix = mat4.create();
		mat4.multiply(normalMatrix, camera.vMatrix, mMatrix);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);
		gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, normalMatrix);
		
		//bind attributes and draw array
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, this.vboOffset*4);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, this.vboOffset*4+this.vertices.length*4);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, this.vboOffset*4+this.vertices.length*4+this.normals.length*4);
		//gl.drawElements(gl.TRIANGLES, this.faces.length, gl.UNSIGNED_SHORT, this.iboOffset*2);
		gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/3);
	};
	
	function parseModel( json, scale ) {

		function isBitSet( value, position ) {

			return value & ( 1 << position );

		}

		var i, j, fi,

		offset, zLength, nVertices,

		colorIndex, normalIndex, uvIndex, materialIndex,

		type,
		isQuad,
		hasMaterial,
		hasFaceUv, hasFaceVertexUv,
		hasFaceNormal, hasFaceVertexNormal,
		hasFaceColor, hasFaceVertexColor,

		vertex, face, color, normal,

		uvLayer, uvs, u, v,

		faces = json.faces,
		vertices = json.vertices,
		normals = json.normals,
		colors = json.colors,

		nUvLayers = 0;

		// disregard empty arrays

		for ( i = 0; i < json.uvs.length; i++ ) {

			if ( json.uvs[ i ].length ) nUvLayers ++;

		}

		for ( i = 0; i < nUvLayers; i++ ) {

			thisObj.uvs.push( new Array());

		}

		offset = 0;
		zLength = vertices.length;

		//while ( offset < zLength ) {
			//thisObj.vertices.push(vertices[offset++] * scale);
			//thisObj.vertices.push(vertices[offset++] * scale);
			//thisObj.vertices.push(vertices[offset++] * scale);
		//}

		offset = 0;
		zLength = faces.length;

		while ( offset < zLength ) {

			type = faces[ offset ++ ];


			isQuad          	= isBitSet( type, 0 );
			hasMaterial         = isBitSet( type, 1 );
			hasFaceUv           = isBitSet( type, 2 );
			hasFaceVertexUv     = isBitSet( type, 3 );
			hasFaceNormal       = isBitSet( type, 4 );
			hasFaceVertexNormal = isBitSet( type, 5 );
			hasFaceColor	    = isBitSet( type, 6 );
			hasFaceVertexColor  = isBitSet( type, 7 );

			//console.log("type", type, "bits", isQuad, hasMaterial, hasFaceUv, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);

			if ( isQuad ) {
				// thisObj.faces.push(faces[ offset ++ ]);
				// thisObj.faces.push(faces[ offset ++ ]);
				// thisObj.faces.push(faces[ offset ++ ]);
				// thisObj.faces.push(faces[ offset ++ ]);
				
				thisObj.vertices.push(vertices[faces[ offset  ] * 3] * scale);
				thisObj.vertices.push(vertices[faces[ offset] * 3 + 1] * scale);
				thisObj.vertices.push(vertices[faces[ offset++] * 3 + 2] * scale);
				
				thisObj.vertices.push(vertices[faces[ offset ] * 3] * scale);
				thisObj.vertices.push(vertices[faces[ offset] * 3 + 1] * scale);
				thisObj.vertices.push(vertices[faces[ offset++] * 3 + 2] * scale);
				
				thisObj.vertices.push(vertices[faces[ offset] * 3] * scale);
				thisObj.vertices.push(vertices[faces[ offset] * 3 + 1] * scale);
				thisObj.vertices.push(vertices[faces[ offset++] * 3 + 2] * scale);
				
				thisObj.vertices.push(vertices[faces[ offset] * 3] * scale);
				thisObj.vertices.push(vertices[faces[ offset] * 3 + 1] * scale);
				thisObj.vertices.push(vertices[faces[ offset++] * 3 + 2] * scale);

				nVertices = 4;
			} else {

				//thisObj.faces.push(faces[ offset ++ ]);
				//thisObj.faces.push(faces[ offset ++ ]);
				//thisObj.faces.push(faces[ offset ++ ]);
				thisObj.vertices.push(vertices[faces[ offset  ] * 3] * scale);
				thisObj.vertices.push(vertices[faces[ offset] * 3 + 1] * scale);
				thisObj.vertices.push(vertices[faces[ offset++] * 3 + 2] * scale);
				
				thisObj.vertices.push(vertices[faces[ offset ] * 3] * scale);
				thisObj.vertices.push(vertices[faces[ offset] * 3 + 1] * scale);
				thisObj.vertices.push(vertices[faces[ offset++] * 3 + 2] * scale);
				
				thisObj.vertices.push(vertices[faces[ offset] * 3] * scale);
				thisObj.vertices.push(vertices[faces[ offset] * 3 + 1] * scale);
				thisObj.vertices.push(vertices[faces[ offset++] * 3 + 2] * scale);
				nVertices = 3;

			}

			if ( hasMaterial ) {

				materialIndex = faces[ offset ++ ];
				thisObj.materialIndex = materialIndex;

			}

			// to get face <=> uv index correspondence

			fi = thisObj.faces.length;

			if ( hasFaceUv ) {

				for ( i = 0; i < nUvLayers; i++ ) {

					uvLayer = json.uvs[ i ];

					uvIndex = faces[ offset ++ ];

					u = uvLayer[ uvIndex * 2 ];
					v = uvLayer[ uvIndex * 2 + 1 ];

					thisObj.uvs[ i ].push(u);
					thisObj.uvs[ i ].push(v);

				}

			}

			if ( hasFaceVertexUv ) {

				for ( i = 0; i < nUvLayers; i++ ) {

					uvLayer = json.uvs[ i ];

					uvs = [];

					for ( j = 0; j < nVertices; j ++ ) {

						uvIndex = faces[ offset ++ ];

						u = uvLayer[ uvIndex * 2 ];
						v = uvLayer[ uvIndex * 2 + 1 ];

						uvs[ j*2 ] = u;
						uvs[ j*2+1 ] = v;
					}
					for(key in uvs){
						thisObj.uvs[ i ].push(uvs[key]);
					}

				}

			}

			if ( hasFaceNormal ) {

				normalIndex = faces[ offset ++ ] * 3;

				thisObj.normals.push( normals[ normalIndex ++ ]);
				thisObj.normals.push( normals[ normalIndex ++ ]);
				thisObj.normals.push( normals[ normalIndex ]);

			}

			if ( hasFaceVertexNormal ) {

				for ( i = 0; i < nVertices; i++ ) {

					normalIndex = faces[ offset ++ ] * 3;

					thisObj.normals.push( normals[ normalIndex ++ ]);
					thisObj.normals.push( normals[ normalIndex ++ ]);
					thisObj.normals.push( normals[ normalIndex ]);

				}

			}


			if ( hasFaceColor ) {

				colorIndex = faces[ offset ++ ];

				thisObj.colors.push( colors[ colorIndex ] );
			}


			if ( hasFaceVertexColor ) {

				for ( i = 0; i < nVertices; i++ ) {

					colorIndex = faces[ offset ++ ];

					thisObj.colors.push( colors[ colorIndex ] );

				}

			}

		}

	};
}