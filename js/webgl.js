var context = null;

function webGL_start(){
	if (window.WebGLRenderingContext) {
		context = new WebGL(document.getElementById("renderCanvas"));
		context.Init();
	}
	else
	{
		document.getElementById("main").innerHTML = "Ihr Browser unterstützt leider kein WebGL. <br />Mehr Informationen zu WebGL unter <a href='http://get.webgl.org' target='_blank'>http://get.webgl.org</a>";
	}
}

function WebGL(canvas){
	//Variables
	//Public:
	this.canvas = canvas;
	
	//Private:
	var gl = null;
	var mvMatrix = mat4.create();
	var mvMatrixStack = [];
	var pMatrix = mat4.create();
	var meshLoader = null;
	var pyramidVertexPositionBuffer = null;
	var cubeVertexPositionBuffer = null;
	var cubeVertexIndexBuffer = null;
	var shaderProgram;
	var rPyramid = 0;
	var rCube = 0;
	var lastTime = 0;
	var dirLight = new DirectionalLight(
		vec3.fromValues(0.0, 1.0, -1.0),
		vec3.fromValues(4.0, 4.0, 4.0),
		vec3.fromValues(1.0, 1.0, 1.0),
		vec3.fromValues(0.5, 0.5, 0.5)
	);
	
	//Methods
	//Public:
	this.Init = function(){
		initGL(this.canvas);
		meshLoader = new MeshLoader(gl);
		initShaders(function(){		
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.enable(gl.DEPTH_TEST);
			gl.enable(gl.TEXTURE_2D);
			
			load(function(){
				update();
			});
		}, function(){alert("Error initialising shaders.");});
	}
	
	//Private:	
	function initGL(canvas){
		try {
			gl = canvas.getContext("experimental-webgl");
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		} catch(e) {
			alert("Initialization error: " + e.description);
		}
		if (!gl) {
			alert("Could not initialise WebGL.");
		}
	}

	function initShaders(callback, errorCallback){
		var fragmentShader;
		var vertexShader;
		getShader(gl, document.URL + "js/shader/diffuse.frag", gl.FRAGMENT_SHADER, function(fshader){
			fragmentShader = fshader;
			getShader(gl, document.URL + "js/shader/diffuse.vert", gl.VERTEX_SHADER, function(vshader){
				vertexShader = vshader;
				shaderProgram = gl.createProgram();
				gl.attachShader(shaderProgram, vertexShader);
				gl.attachShader(shaderProgram, fragmentShader);
				gl.linkProgram(shaderProgram);

				if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
					alert("Could not initialise shaders");
				}

				gl.useProgram(shaderProgram);
				
				shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
				gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
				
				shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
				gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
				
				shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
				gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
				
				shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
				shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
				shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
				
				shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
				shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
				shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
				shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
				
				callback();
			}, function(){
				alert("Couldn't load vertex shader.");
				errorCallback();
			});
		}, function(){
			alert("Couldn't load fragment shader.");
			errorCallback();
		});
	}
	
	function getShader(gl, file, type, callback, errorCallback) {	
		var shaderText = $.ajax({ 
			url: file, 
			dataType: "text",
			success : function(shaderText){
				var shader = gl.createShader(type);
				gl.shaderSource(shader, shaderText);
				gl.compileShader(shader);
				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					alert(gl.getShaderInfoLog(shader));
					return null;
				}
				callback(shader);
			}
		});
	}
	
	function setMatrixUniforms() {
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
		var normalMatrix = mat4.clone(mvMatrix);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);
		gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, normalMatrix);
	}
	
	function setLightingUniforms(){
		gl.uniform3fv(shaderProgram.directionalColorUniform, dirLight.diffuse);
		gl.uniform3fv(shaderProgram.ambientColorUniform, dirLight.ambient);
		gl.uniform3fv(shaderProgram.lightingDirectionUniform, dirLight.position);
	}
	
	function mvPushMatrix() {
		var copy = mat4.clone(mvMatrix);
		mvMatrixStack.push(copy);
	}

	function mvPopMatrix() {
		if (mvMatrixStack.length == 0) {
			throw "Invalid popMatrix!";
		}
		mvMatrix = mvMatrixStack.pop();
	}
	
	function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
	
	function load(callback){
		meshLoader.LoadMesh("spinne", "models/spinne.js", function(){
			meshLoader.BindToBuffers();
			callback();
		});
		
	}
	
	function update(){
		requestAnimFrame(update);
		draw();
		animate();
	}
	
	function animate() {
		var timeNow = new Date().getTime();
		if (lastTime != 0) {
			var elapsed = timeNow - lastTime;

			rPyramid += (90 * elapsed) / 1000.0;
			rCube -= (75 * elapsed) / 1000.0;
		}
		lastTime = timeNow;
	}
	
	function draw(){
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
		mat4.identity(mvMatrix);
		
		mat4.translate(mvMatrix, mvMatrix, [-1.5, 1.0, -7.0]);
		mvPushMatrix();
		mat4.rotate(mvMatrix, mvMatrix, degToRad(rPyramid), [1, 1, 0]);

		meshLoader.Bind();
		setMatrixUniforms();
		setLightingUniforms();
		meshLoader.meshes["spinne"].Draw(shaderProgram);
		mvPopMatrix();
	}
}