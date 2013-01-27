function Level(context){
	var gl = context;
	var meshLoader = new MeshLoader(gl);
	
	this.load = function(callback){
		// meshLoader.LoadMesh("spinne", "models/spinne.js", 1, function(){
			// meshLoader.LoadScene("models/wohnung2.js", function(){
				// meshLoader.BindToBuffers();
				// callback();
			// });
		// });
		
		meshLoader.LoadScene("models/shootermesh/shootermesh.js", function(){
			meshLoader.BindToBuffers();
			callback();
		});
	};
	
	//var transVec = vec3.fromValues(0.0, 0.02, 0.0);
	
	this.update = function(elapsed){
		// for(key in meshLoader.meshes){
			// meshLoader.meshes[key].Translate(transVec);
		// }
	};
	
	this.draw = function(shaderProgram, camera){
		meshLoader.Bind();
		//meshLoader.meshes["spinne"].Draw(shaderProgram);
		for(key in meshLoader.meshes){
			meshLoader.meshes[key].Draw(shaderProgram,camera);
		}
		//meshLoader.meshes["crate"].Draw(shaderProgram);
		// meshLoader.meshes["Mesh.007_doorMesh"].Draw(shaderProgram);
		// meshLoader.meshes["Mesh_lightFixturesMesh"].Draw(shaderProgram);
		// meshLoader.meshes["Mesh.003_innerHallWayMesh"].Draw(shaderProgram);
		// meshLoader.meshes["Mesh.002_loadingDockMesh"].Draw(shaderProgram);
		// meshLoader.meshes["Mesh.001_observatory"].Draw(shaderProgram);
		// meshLoader.meshes["Mesh.005_frontEndMesh"].Draw(shaderProgram);
		// meshLoader.meshes["Mesh.006_roofTileMesh"].Draw(shaderProgram);
		// meshLoader.meshes["Mesh.004_frontRoomMesh"].Draw(shaderProgram);
		// meshLoader.meshes["polySurface5"].Draw(shaderProgram);
		// meshLoader.meshes["polySurface8"].Draw(shaderProgram);
		// meshLoader.meshes["polySurface7"].Draw(shaderProgram);
		// meshLoader.meshes["polySurface6"].Draw(shaderProgram);
		// meshLoader.meshes["polySurface3"].Draw(shaderProgram);
		// meshLoader.meshes["pSphere1"].Draw(shaderProgram);
		// meshLoader.meshes["pasted__pPlane2_boden_OG"].Draw(shaderProgram);
		// meshLoader.meshes["pCube4"].Draw(shaderProgram);
		// meshLoader.meshes["pCube3"].Draw(shaderProgram);
		// meshLoader.meshes["boden_UG"].Draw(shaderProgram);
		// meshLoader.meshes["polySurface10"].Draw(shaderProgram);
	};
}