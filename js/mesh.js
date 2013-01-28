function Mesh(context){
	this.vertices = [];
	this.normals = [];
	this.faces = [];
	this.colors = [];
	this.uvs = [];
	this.materialIndex;
	this.texture = null;
	this.vboOffset = 0;
	this.iboOffset = 0;
	this.lit = true;
	this.mMatrix = mat4.create();
	this.position = vec3.create();
	var thisObj = this;
	var gl = context;
	this.alpha = 1.0;
	this.transparent = false;
	
	this.Load = function(filename, pos, quatRotation, vecScale, callback){
		$.getJSON(filename, function(json){
			mat4.fromRotationTranslation(thisObj.mMatrix, quatRotation, pos);
			mat4.scale(thisObj.mMatrix, thisObj.mMatrix, vecScale);
			vec3.copy(thisObj.position, pos);
			parseModel(json, 1.0);
			thisObj.alpha = json.materials[thisObj.materialIndex].transparency;
			thisObj.transparent = json.materials[thisObj.materialIndex].transparent;
			if(json.materials[thisObj.materialIndex].mapDiffuse !== undefined){
				loadTexture(json.materials[thisObj.materialIndex].mapDiffuse, function(){
					callback();
				});
			}else{
				callback();
			}
		});
	};
	
	function handleTextureLoaded(image, texture) {
		
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		
		//Anisotropic Filtering
		var ext = (
			gl.getExtension('EXT_texture_filter_anisotropic') ||
			gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
			gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
		);
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
		//bind textures and lit
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		gl.uniform1i(shaderProgram.lightsOnUniform, this.lit);
		
		//Alpha Blending
		if(this.transparent && this.alpha < 1.0){
			gl.enable( gl.BLEND );
			gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
			//gl.disable(gl.DEPTH_TEST);
		}else{
			gl.disable(gl.BLEND);
			//gl.enable(gl.DEPTH_TEST);
		}
		gl.uniform1f(shaderProgram.alphaUniform, this.alpha);
		
		//bind attributes and draw array
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		if(thisObj.uvs.length > 0){
			gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
			gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, this.vboOffset*4+this.vertices.length*4+this.normals.length*4);
		}
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